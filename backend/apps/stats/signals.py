from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserStatistic
from apps.users.models import User


@receiver(post_save, sender=User)
def create_user_statistics(sender, instance, created, **kwargs):
    """Crea estadísticas cuando se crea un nuevo usuario."""
    if created and instance.role == 'user':
        UserStatistic.objects.get_or_create(user=instance)