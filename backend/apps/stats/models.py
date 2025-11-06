from django.db import models
from django.conf import settings


class XpHistory(models.Model):
    """Registra cada ganancia de XP del usuario."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="xp_history")
    xp_gained = models.PositiveIntegerField()
    source = models.CharField(max_length=100, help_text="Origen del XP (quiz, curso, evento, etc.)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} +{self.xp_gained} XP ({self.source})"
