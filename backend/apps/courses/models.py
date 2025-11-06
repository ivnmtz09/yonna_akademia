from django.db import models
from django.conf import settings


class Course(models.Model):
    """Representa un curso desbloqueable según el nivel del estudiante."""

    LEVEL_CHOICES = [(i, f"Nivel {i}") for i in range(1, 11)]

    title = models.CharField(max_length=200)
    description = models.TextField()
    level_required = models.PositiveIntegerField(choices=LEVEL_CHOICES, default=1)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["level_required", "title"]

    def __str__(self):
        return f"{self.title} (Nivel {self.level_required})"


class Enrollment(models.Model):
    """Registra la inscripción de un estudiante en un curso."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    progress = models.FloatField(default=0.0)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "course")

    def __str__(self):
        return f"{self.user.email} en {self.course.title} ({self.progress}%)"
