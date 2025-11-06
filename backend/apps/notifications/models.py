from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notificaciones internas visibles para los usuarios."""
    NOTIFICATION_TYPES = [
        ("level_up", "Subida de nivel"),
        ("new_course", "Nuevo curso disponible"),
        ("quiz_result", "Resultado de quiz"),
        ("achievement", "Logro especial"),
        ("system", "Sistema"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES, default="system")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} → {self.user.email}"

    def mark_as_read(self):
        self.is_read = True
        self.save(update_fields=["is_read"])
