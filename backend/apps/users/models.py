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
        extra_fields.setdefault("role", "admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(_("nombre de usuario"), max_length=150, unique=False, blank=True, null=True)
    email = models.EmailField(_("correo electrónico"), unique=True)

    # Nuevos roles simplificados
    ROLE_CHOICES = (
        ("admin", "Administrador"),
        ("moderator", "Moderador"),
        ("user", "Usuario"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    bio = models.TextField("biografía corta", blank=True, null=True)

    # Sistema de niveles con XP
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"

    # --- Lógica de XP y Niveles ---
    def add_xp(self, amount, source="quiz"):
        """Añade XP al usuario y registra el evento automáticamente."""
        if amount <= 0:
            return

        old_xp = self.xp
        self.xp += amount
        self.save(update_fields=["xp"])
        self._update_level()  # recalcula el nivel si es necesario

        # Lanza una signal para registrar el evento en XpHistory
        from apps.users.signals import xp_gained_signal
        xp_gained_signal.send(sender=self.__class__, user=self, amount=amount, source=source)

    def _update_level(self):
        thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000]
        new_level = 1
        for i, threshold in enumerate(thresholds, start=1):
            if self.xp >= threshold:
                new_level = i
        if self.level != new_level:
            self.level = new_level
            self.save(update_fields=["level"])

    # Propiedades de conveniencia para verificar roles
    @property
    def is_admin(self):
        return self.role == "admin"

    @property
    def is_moderator(self):
        return self.role == "moderator"

    @property
    def is_regular_user(self):
        return self.role == "user"


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