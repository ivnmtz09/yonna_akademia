from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Enrollment
from apps.notifications.models import Notification


@receiver(post_save, sender=Enrollment)
def notify_course_enrollment(sender, instance, created, **kwargs):
    if created:
        # Notificar al usuario que se inscribió correctamente
        Notification.objects.create(
            user=instance.user,
            type="progress_update",
            title="✅ Inscripción exitosa",
            message=f"Te has inscrito en el curso '{instance.course.title}'. ¡Comienza a aprender!",
            related_course_id=instance.course.id,
        )