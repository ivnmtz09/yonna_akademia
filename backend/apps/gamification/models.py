from django.db import models
from django.conf import settings
from django.utils import timezone


# ──────────────────────────────────────────────────────────────────────────────
# RACHAS (Streaks)
# ──────────────────────────────────────────────────────────────────────────────

class Streak(models.Model):
    """
    Rastrea la racha diaria de actividad de un usuario.
    Se actualiza cada vez que el usuario completa una lección o quiz.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="streak",
        verbose_name="Usuario",
    )
    current_streak = models.PositiveIntegerField(
        default=0,
        verbose_name="Racha actual (días)",
    )
    longest_streak = models.PositiveIntegerField(
        default=0,
        verbose_name="Racha más larga (días)",
    )
    last_activity_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Última actividad",
    )
    freeze_tokens = models.PositiveSmallIntegerField(
        default=0,
        verbose_name="Tokens de congelación",
        help_text="Permiten al usuario conservar su racha un día sin actividad.",
    )

    class Meta:
        verbose_name = "Racha"
        verbose_name_plural = "Rachas"

    def __str__(self):
        return f"{self.user} — racha: {self.current_streak} días"

    def register_activity(self):
        """
        Llama este método una vez por día cuando el usuario completa actividad.
        Actualiza current_streak y longest_streak automáticamente.
        """
        today = timezone.localdate()

        if self.last_activity_date is None:
            # Primera actividad
            self.current_streak = 1
        elif self.last_activity_date == today:
            # Ya registró actividad hoy, nada que hacer
            return
        elif (today - self.last_activity_date).days == 1:
            # Actividad consecutiva
            self.current_streak += 1
        elif (today - self.last_activity_date).days == 2 and self.freeze_tokens > 0:
            # Día de gracia usando un token de congelación
            self.freeze_tokens -= 1
            self.current_streak += 1
        else:
            # Racha rota
            self.current_streak = 1

        self.last_activity_date = today
        self.longest_streak = max(self.longest_streak, self.current_streak)
        self.save(update_fields=[
            "current_streak", "longest_streak", "last_activity_date", "freeze_tokens"
        ])


# ──────────────────────────────────────────────────────────────────────────────
# INSIGNIAS (Badges)
# ──────────────────────────────────────────────────────────────────────────────

class Badge(models.Model):
    """Catálogo de insignias disponibles en la plataforma."""

    class Trigger(models.TextChoices):
        STREAK = "streak", "Racha de días"
        LESSONS_COMPLETED = "lessons", "Lecciones completadas"
        QUIZZES_PERFECT = "quiz_perfect", "Quiz perfecto"
        VOCABULARY_MASTERED = "vocab", "Vocabulario dominado"
        FIRST_LOGIN = "first_login", "Primer inicio de sesión"
        COURSE_COMPLETED = "course", "Curso completado"

    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(verbose_name="Descripción")
    icon = models.ImageField(
        upload_to="badges/icons/",
        null=True,
        blank=True,
        verbose_name="Ícono",
    )
    trigger = models.CharField(
        max_length=30,
        choices=Trigger.choices,
        verbose_name="Condición de disparo",
    )
    threshold = models.PositiveIntegerField(
        default=1,
        verbose_name="Umbral",
        help_text="Valor numérico necesario para obtener la insignia (ej: 7 días de racha).",
    )
    xp_reward = models.PositiveIntegerField(
        default=0,
        verbose_name="XP otorgada al obtener la insignia",
    )
    is_active = models.BooleanField(default=True, verbose_name="Activa")

    class Meta:
        verbose_name = "Insignia"
        verbose_name_plural = "Insignias"
        ordering = ["trigger", "threshold"]

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """Tabla pivote: insignias obtenidas por cada usuario."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="badges",
        verbose_name="Usuario",
    )
    badge = models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        related_name="user_badges",
        verbose_name="Insignia",
    )
    earned_at = models.DateTimeField(auto_now_add=True, verbose_name="Obtenida el")

    class Meta:
        unique_together = ("user", "badge")
        verbose_name = "Insignia de usuario"
        verbose_name_plural = "Insignias de usuarios"
        ordering = ["-earned_at"]

    def __str__(self):
        return f"{self.user} → {self.badge}"


# ──────────────────────────────────────────────────────────────────────────────
# PUNTOS XP
# ──────────────────────────────────────────────────────────────────────────────

class XPTransaction(models.Model):
    """
    Registro inmutable de cada ganancia/pérdida de XP.
    Sirve como fuente de verdad para el leaderboard y el historial.
    """
    class Reason(models.TextChoices):
        LESSON_COMPLETE = "lesson_complete", "Lección completada"
        QUIZ_PASSED = "quiz_passed", "Quiz aprobado"
        QUIZ_PERFECT = "quiz_perfect", "Quiz perfecto (100%)"
        STREAK_BONUS = "streak_bonus", "Bono de racha"
        BADGE_EARNED = "badge_earned", "Insignia obtenida"
        VOCAB_MASTERED = "vocab_mastered", "Palabra dominada"
        ADMIN_ADJUSTMENT = "admin", "Ajuste manual"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="xp_transactions",
        verbose_name="Usuario",
    )
    amount = models.IntegerField(
        verbose_name="Cantidad de XP",
        help_text="Positivo para ganancias, negativo para penalizaciones.",
    )
    reason = models.CharField(
        max_length=30,
        choices=Reason.choices,
        verbose_name="Motivo",
    )
    reference_id = models.PositiveBigIntegerField(
        null=True,
        blank=True,
        verbose_name="ID del objeto relacionado",
        help_text="Ej: ID de la lección completada.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Transacción de XP"
        verbose_name_plural = "Transacciones de XP"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.user} {'+' if self.amount >= 0 else ''}{self.amount} XP ({self.reason})"
