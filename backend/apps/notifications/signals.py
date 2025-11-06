from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification

# modelos que disparan notificaciones
from apps.quizzes.models import QuizAttempt
from apps.courses.models import Course
from apps.stats.models import XpHistory

# para detectar subida de nivel: guardamos level previo en pre_save
_user_old_level = {}

from django.contrib.auth import get_user_model
User = get_user_model()


# ---------- helper: enviar por WebSocket ----------
def send_realtime_notification(notification):
    """Envía la notificación recién creada al canal del usuario."""
    channel_layer = get_channel_layer()
    group_name = f"user_{notification.user.id}"
    data = {
        "type": "new",
        "notification": {
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "is_read": notification.is_read,
            "created_at": str(notification.created_at),
        }
    }
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",  # invoca NotificationConsumer.send_notification
            "data": data
        },
    )


# ---------- 1) detectamos cambio de nivel en User ----------
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
    # ignorar usuarios no estudiantes
    if created:
        return
    old_level = _user_old_level.pop(instance.pk, None)
    if old_level is None:
        return
    if instance.level > old_level:
        notif = Notification.objects.create(
            user=instance,
            type="level_up",
            title="¡Has subido de nivel!",
            message=f"Felicidades — ahora eres nivel {instance.level}. Sigue así.",
        )
        send_realtime_notification(notif)


# ---------- 2) Nuevo curso: notificar a estudiantes elegibles ----------
@receiver(post_save, sender=Course)
def notify_new_course(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    # notificar a estudiantes con level >= level_required
    estudiantes = User.objects.filter(role="student", level__gte=instance.level_required)
    notifs = []
    for estudiante in estudiantes:
        notifs.append(Notification(
            user=estudiante,
            type="new_course",
            title="Nuevo curso disponible",
            message=f"Se ha añadido '{instance.title}' (Nivel {instance.level_required}). ¡Échale un vistazo!",
        ))
    Notification.objects.bulk_create(notifs)

    # enviar en tiempo real (iterativo)
    for n in Notification.objects.filter(id__gte=notifs[0].id if notifs else 0, user__in=[u.user for u in notifs]):
        send_realtime_notification(n)


# ---------- 3) Resultado de quiz ----------
@receiver(post_save, sender=QuizAttempt)
def notify_quiz_result(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.passed:
        title = "Quiz aprobado"
        message = f"¡Bien! Aprobaste '{instance.quiz.title}' y obtuviste {instance.quiz.xp_reward} XP."
    else:
        title = "Quiz no aprobado"
        message = f"No aprobaste '{instance.quiz.title}'. Puedes intentar otro quiz para ganar XP."

    notif = Notification.objects.create(
        user=instance.user,
        type="quiz_result",
        title=title,
        message=message,
    )
    send_realtime_notification(notif)


# ---------- 4) Logros: escuchar XpHistory (registro de ganancia de XP) ----------
MILESTONES = [1000, 2000, 5000, 10000]

@receiver(post_save, sender=XpHistory)
def notify_achievement_on_xp_history(sender, instance, created, **kwargs):
    if not created:
        return
    user = instance.user
    # comprobar si el total de XP del usuario coincide con un milestone (o lo superó)
    total_xp = getattr(user, "xp", None)
    if total_xp is None:
        return
    if total_xp in MILESTONES:
        notif = Notification.objects.create(
            user=user,
            type="achievement",
            title="¡Logro desbloqueado!",
            message=f"Has alcanzado {total_xp} XP. ¡Buen trabajo!",
        )
        send_realtime_notification(notif)
