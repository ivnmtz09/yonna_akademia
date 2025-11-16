from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notificaciones internas visibles para los usuarios."""
    
    # Tipos de notificación actualizados según los requerimientos
    NOTIFICATION_TYPES = [
        # Para todos los usuarios
        ("new_course", "Nuevo curso disponible"),
        ("new_quiz", "Nuevo quiz disponible"),
        ("progress_update", "Progreso actualizado"),
        ("level_up", "Nivel aumentado"),
        
        # Solo para moderadores
        ("user_report", "Usuario reportó un problema"),
        ("course_completed", "Usuario completó curso"),
        
        # Solo para admin
        ("new_moderator", "Nuevo moderador registrado"),
        ("system_error", "Error crítico del sistema"),
        
        # Gamificación
        ("study_streak", "Racha de estudio"),
        ("reward_unlocked", "Recompensa desbloqueada"),
        
        # Genérico
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
    
    # Campos adicionales para referenciar objetos relacionados
    related_course_id = models.PositiveIntegerField(null=True, blank=True)
    related_quiz_id = models.PositiveIntegerField(null=True, blank=True)
    related_user_id = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=['user', 'is_read', 'created_at']),
            models.Index(fields=['type', 'created_at']),
        ]

    def __str__(self):
        return f"{self.title} → {self.user.email}"

    def mark_as_read(self):
        self.is_read = True
        self.save(update_fields=["is_read"])