from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Administrador"),
        ("teacher", "Sabedor/Docente"),
        ("student", "Estudiante"),
    )

    LEVEL_CHOICES = (
        ("beginner", "Principiante"),
        ("intermediate", "Intermedio"),
        ("advanced", "Avanzado"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
