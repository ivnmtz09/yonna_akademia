from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import QuizAttempt
from apps.notifications.models import Notification


@receiver(post_save, sender=QuizAttempt)
def notify_quiz_result(sender, instance, created, **kwargs):
    if created and instance.passed:
        Notification.objects.create(
            user=instance.user,
            type="progress_update",
            title="🎉 ¡Quiz aprobado!",
            message=f"Felicidades, aprobaste '{instance.quiz.title}' y ganaste {instance.quiz.xp_reward} XP",
            related_quiz_id=instance.quiz.id,
            related_course_id=instance.quiz.course.id,
        )