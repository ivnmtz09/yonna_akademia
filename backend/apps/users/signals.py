from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from .models import User, Profile
from apps.stats.models import XpHistory

# Signal personalizada para cuando el usuario gana XP
xp_gained_signal = Signal()


@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    """Crea un perfil automáticamente cuando se crea un usuario."""
    if created:
        Profile.objects.create(usuario=instance)


@receiver(xp_gained_signal)
def registrar_ganancia_xp(sender, **kwargs):
    """Registra automáticamente una entrada en XpHistory cuando el usuario gana XP."""
    user = kwargs.get("user")
    amount = kwargs.get("amount")
    source = kwargs.get("source", "sistema")

    if user and amount:
        XpHistory.objects.create(user=user, xp_gained=amount, source=source)