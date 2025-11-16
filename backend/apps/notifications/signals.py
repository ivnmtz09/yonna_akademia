from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification

# Modelos que disparan notificaciones
from apps.quizzes.models import QuizAttempt, Quiz
from apps.courses.models import Course, Enrollment
from apps.stats.models import XpHistory
from apps.users.models import User

# Para detectar subida de nivel: guardamos level previo en pre_save
_user_old_level = {}


# ---------- helper: enviar por WebSocket ----------
def send_realtime_notification(notification):
    """Envía la notificación recién creada al canal del usuario."""
    try:
        channel_layer = get_channel_layer()
        group_name = f"user_{notification.user.id}"
        data = {
            "type": "new_notification",
            "notification": {
                "id": notification.id,
                "title": notification.title,
                "message": notification.message,
                "type": notification.type,
                "is_read": notification.is_read,
                "created_at": notification.created_at.isoformat(),
                "related_course_id": notification.related_course_id,
                "related_quiz_id": notification.related_quiz_id,
            }
        }
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "data": data
            },
        )
    except Exception as e:
        # Log error but don't break the application
        print(f"Error sending WebSocket notification: {e}")


# ---------- A. NOTIFICACIONES PARA TODOS LOS USUARIOS ----------

# 1. Nuevo curso disponible (cuando un moderador crea un curso)
@receiver(post_save, sender=Course)
def notify_new_course(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    # Notificar a todos los usuarios con nivel suficiente
    usuarios = User.objects.filter(
        level__gte=instance.level_required,
        is_active=True
    )
    
    notifs = []
    for usuario in usuarios:
        notifs.append(Notification(
            user=usuario,
            type="new_course",
            title="🎓 Nuevo curso disponible",
            message=f"Se ha añadido '{instance.title}'. ¡Comienza a aprender!",
            related_course_id=instance.id,
        ))
    
    if notifs:
        Notification.objects.bulk_create(notifs)
        # Enviar notificaciones en tiempo real
        for notification in Notification.objects.filter(
            id__in=[n.id for n in notifs]
        ).select_related('user'):
            send_realtime_notification(notification)


# 2. Nuevo quiz disponible (cuando se crea un quiz en un curso inscrito)
@receiver(post_save, sender=Quiz)
def notify_new_quiz(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    # Notificar a usuarios inscritos en el curso
    from apps.courses.models import Enrollment
    enrollements = Enrollment.objects.filter(
        course=instance.course,
        is_active=True
    ).select_related('user')
    
    notifs = []
    for enrollment in enrollements:
        notifs.append(Notification(
            user=enrollment.user,
            type="new_quiz",
            title="📝 Nuevo quiz disponible",
            message=f"Nuevo quiz disponible en '{instance.course.title}': {instance.title}",
            related_course_id=instance.course.id,
            related_quiz_id=instance.id,
        ))
    
    if notifs:
        Notification.objects.bulk_create(notifs)
        for notification in Notification.objects.filter(
            id__in=[n.id for n in notifs]
        ).select_related('user'):
            send_realtime_notification(notification)


# 3. Progreso actualizado (cuando completa un quiz y gana XP)
@receiver(post_save, sender=QuizAttempt)
def notify_quiz_progress(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.passed:
        notif = Notification.objects.create(
            user=instance.user,
            type="progress_update",
            title="📈 Progreso actualizado",
            message=f"¡Completaste '{instance.quiz.title}'! Ganaste {instance.quiz.xp_reward} XP.",
            related_course_id=instance.quiz.course.id,
            related_quiz_id=instance.quiz.id,
        )
        send_realtime_notification(notif)


# 4. Nivel aumentado
@receiver(pre_save, sender=User)
def cache_old_level(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = sender.objects.get(pk=instance.pk)
        _user_old_level[instance.pk] = old.level
    except sender.DoesNotExist:
        _user_old_level[instance.pk] = None

@receiver(post_save, sender=User)
def notify_level_change(sender, instance, created, **kwargs):
    if created:
        return
        
    old_level = _user_old_level.pop(instance.pk, None)
    if old_level is None:
        return
        
    if instance.level > old_level:
        notif = Notification.objects.create(
            user=instance,
            type="level_up",
            title="🎉 ¡Has subido de nivel!",
            message=f"Felicidades — ahora eres nivel {instance.level}. Sigue así.",
        )
        send_realtime_notification(notif)


# ---------- B. NOTIFICACIONES SOLO PARA MODERADORES ----------

# 5. Usuario reportó un problema
# 6. Usuario completó todos los quizzes del curso
@receiver(post_save, sender=Enrollment)
def notify_course_completion(sender, instance, created, **kwargs):
    if created or not instance.completed:
        return

    # Verificar si completó todos los quizzes
    from apps.quizzes.models import Quiz, QuizAttempt
    course_quizzes = Quiz.objects.filter(course=instance.course, is_active=True)
    completed_quizzes = QuizAttempt.objects.filter(
        user=instance.user,
        quiz__in=course_quizzes,
        passed=True
    ).values('quiz').distinct()

    if completed_quizzes.count() == course_quizzes.count():
        # Notificar a moderadores del curso
        moderators = User.objects.filter(
            role="moderator", 
            is_active=True
        )
        
        notifs = []
        for moderator in moderators:
            notifs.append(Notification(
                user=moderator,
                type="course_completed",
                title="✅ Curso completado",
                message=f"{instance.user.email} completó todos los quizzes de '{instance.course.title}'",
                related_user_id=instance.user.id,
                related_course_id=instance.course.id,
            ))
        
        if notifs:
            Notification.objects.bulk_create(notifs)
            for notification in Notification.objects.filter(
                id__in=[n.id for n in notifs]
            ).select_related('user'):
                send_realtime_notification(notification)


# ---------- C. NOTIFICACIONES SOLO PARA ADMIN ----------

# 7. Nuevo moderador registrado
@receiver(post_save, sender=User)
def notify_new_moderator(sender, instance, created, **kwargs):
    if not created or instance.role != "moderator":
        return

    # Notificar a todos los admins
    admins = User.objects.filter(role="admin", is_active=True)
    
    notifs = []
    for admin in admins:
        notifs.append(Notification(
            user=admin,
            type="new_moderator",
            title="👤 Nuevo moderador",
            message=f"Se ha registrado el moderador: {instance.get_full_name()} ({instance.email})",
            related_user_id=instance.id,
        ))
    
    if notifs:
        Notification.objects.bulk_create(notifs)
        for notification in Notification.objects.filter(
            id__in=[n.id for n in notifs]
        ).select_related('user'):
            send_realtime_notification(notification)


# ---------- D. NOTIFICACIONES DE GAMIFICACIÓN ----------

# 8. Racha de estudio (se implementaría con un sistema de streaks)
def notify_study_streak(user, streak_days):
    """Notificar racha de estudio (llamar desde tareas periódicas)"""
    notif = Notification.objects.create(
        user=user,
        type="study_streak",
        title="🔥 Racha de estudio",
        message=f"¡Increíble! Llevas {streak_days} días seguidos estudiando.",
    )
    send_realtime_notification(notif)


# 9. Recompensa desbloqueada
@receiver(post_save, sender=XpHistory)
def notify_reward_unlocked(sender, instance, created, **kwargs):
    if not created:
        return

    # Milestones de XP para recompensas
    MILESTONES = [100, 250, 500, 1000, 2000, 5000]
    user_total_xp = instance.user.xp
    
    if user_total_xp in MILESTONES:
        notif = Notification.objects.create(
            user=instance.user,
            type="reward_unlocked",
            title="🏆 Recompensa desbloqueada",
            message=f"¡Felicidades! Has alcanzado {user_total_xp} XP y desbloqueado una recompensa especial.",
        )
        send_realtime_notification(notif)


# ---------- NOTIFICACIONES DE ERRORES CRÍTICOS ----------

def notify_system_error(error_message, stack_trace=None):
    """Notificar error crítico a los admins"""
    admins = User.objects.filter(role="admin", is_active=True)
    
    notifs = []
    for admin in admins:
        message = f"Error del sistema: {error_message}"
        if stack_trace:
            message += f"\n\nDetalles: {stack_trace[:200]}..."
            
        notifs.append(Notification(
            user=admin,
            type="system_error",
            title="❌ Error crítico del sistema",
            message=message,
        ))
    
    if notifs:
        Notification.objects.bulk_create(notifs)
        for notification in Notification.objects.filter(
            id__in=[n.id for n in notifs]
        ).select_related('user'):
            send_realtime_notification(notification)