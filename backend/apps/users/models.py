from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """Manager personalizado para manejar usuarios con email en lugar de username."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un correo electrónico válido")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Crea y guarda un superusuario con el correo y contraseña."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(_("nombre de usuario"), max_length=150, unique=False, blank=True, null=True)
    email = models.EmailField(_("correo electrónico"), unique=True)

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
    bio = models.TextField("biografía corta", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"


class Profile(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    telefono = models.CharField("teléfono", max_length=30, blank=True, null=True)
    gustos = models.JSONField("gustos", default=list, blank=True)
    fecha_nacimiento = models.DateField("fecha de nacimiento", blank=True, null=True)
    localidad = models.CharField("localidad", max_length=100, blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil de {self.usuario.email}"
