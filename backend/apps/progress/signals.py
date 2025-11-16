from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.quizzes.models import QuizAttempt
from apps.courses.models import Enrollment
from .models import Progress, GlobalProgress


@receiver(post_save, sender=QuizAttempt)
def update_progress_on_quiz_attempt(sender, instance, created, **kwargs):
    """Actualiza el progreso cuando se completa un quiz attempt."""
    if created and instance.passed:
        # Actualizar progreso del curso
        progress = Progress.update_user_progress_for_course(
            instance.user, 
            instance.quiz.course
        )
        
        # Actualizar progreso global
        GlobalProgress.update_for_user(instance.user)


@receiver(post_save, sender=Enrollment)
def create_progress_on_enrollment(sender, instance, created, **kwargs):
    """Crea un registro de progreso cuando un usuario se inscribe en un curso."""
    if created:
        Progress.objects.get_or_create(
            user=instance.user,
            course=instance.course
        )
        # Actualizar progreso global
        GlobalProgress.update_for_user(instance.user)