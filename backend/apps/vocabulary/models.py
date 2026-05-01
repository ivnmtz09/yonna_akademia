from django.db import models


# ──────────────────────────────────────────────────────────────────────────────
# Categorías temáticas del vocabulario
# ──────────────────────────────────────────────────────────────────────────────

class VocabularyCategory(models.Model):
    """
    Agrupa palabras por tema: saludos, familia, animales, colores, etc.
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Categoría")
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, verbose_name="Descripción")
    icon = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Ícono (emoji o clave de ícono)",
    )
    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name="Orden de visualización",
    )

    class Meta:
        verbose_name = "Categoría de vocabulario"
        verbose_name_plural = "Categorías de vocabulario"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


# ──────────────────────────────────────────────────────────────────────────────
# Entrada del diccionario Wayuunaiki ↔ Español
# ──────────────────────────────────────────────────────────────────────────────

class VocabularyEntry(models.Model):
    """
    Representa una palabra o frase bilingüe con audio de pronunciación y ejemplos.
    """

    class DifficultyLevel(models.TextChoices):
        BEGINNER = "beginner", "Principiante"
        INTERMEDIATE = "intermediate", "Intermedio"
        ADVANCED = "advanced", "Avanzado"

    class WordType(models.TextChoices):
        NOUN = "noun", "Sustantivo"
        VERB = "verb", "Verbo"
        ADJECTIVE = "adjective", "Adjetivo"
        ADVERB = "adverb", "Adverbio"
        PHRASE = "phrase", "Frase"
        GREETING = "greeting", "Saludo"
        OTHER = "other", "Otro"

    # ── Contenido principal ────────────────────────────────────────────────
    spanish_term = models.CharField(
        max_length=200,
        verbose_name="Término en español",
        db_index=True,
    )
    wayuunaiki_translation = models.CharField(
        max_length=200,
        verbose_name="Traducción al Wayuunaiki",
        db_index=True,
    )
    phonetic_transcription = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Transcripción fonética",
        help_text="Representación fonética aproximada para hispanohablantes.",
    )

    # ── Clasificación ──────────────────────────────────────────────────────
    category = models.ForeignKey(
        VocabularyCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="entries",
        verbose_name="Categoría",
    )
    word_type = models.CharField(
        max_length=20,
        choices=WordType.choices,
        default=WordType.OTHER,
        verbose_name="Tipo de palabra",
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.BEGINNER,
        verbose_name="Nivel de dificultad",
    )

    # ── Multimedia ─────────────────────────────────────────────────────────
    audio_pronunciation = models.FileField(
        upload_to="vocabulary/audio/%Y/%m/",
        null=True,
        blank=True,
        verbose_name="Audio de pronunciación",
        help_text="Archivo de audio .mp3 o .ogg con la pronunciación nativa.",
    )
    image = models.ImageField(
        upload_to="vocabulary/images/%Y/%m/",
        null=True,
        blank=True,
        verbose_name="Imagen ilustrativa",
    )

    # ── Ejemplos de uso ────────────────────────────────────────────────────
    usage_examples = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Ejemplos de uso",
        help_text=(
            "Lista de objetos JSON con la estructura: "
            '[{"spanish": "...", "wayuunaiki": "...", "context": "..."}]'
        ),
    )

    # ── Metadatos ──────────────────────────────────────────────────────────
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Destacada",
        help_text="Aparece en la sección 'Palabra del día'.",
    )
    is_active = models.BooleanField(default=True, verbose_name="Activa")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Entrada de vocabulario"
        verbose_name_plural = "Entradas de vocabulario"
        ordering = ["spanish_term"]
        indexes = [
            models.Index(fields=["category", "difficulty"]),
            models.Index(fields=["word_type"]),
            models.Index(fields=["is_featured", "is_active"]),
        ]

    def __str__(self):
        return f"{self.spanish_term} → {self.wayuunaiki_translation}"


# ──────────────────────────────────────────────────────────────────────────────
# Progreso de vocabulario por usuario
# ──────────────────────────────────────────────────────────────────────────────

class UserVocabularyProgress(models.Model):
    """
    Rastrea si un usuario ha practicado/dominado cada palabra.
    Implementa el patrón SRS (Spaced Repetition System) básico.
    """

    class MasteryLevel(models.IntegerChoices):
        SEEN = 0, "Vista"
        LEARNING = 1, "Aprendiendo"
        FAMILIAR = 2, "Familiar"
        MASTERED = 3, "Dominada"

    from django.conf import settings as django_settings

    user = models.ForeignKey(
        django_settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vocabulary_progress",
        verbose_name="Usuario",
    )
    entry = models.ForeignKey(
        VocabularyEntry,
        on_delete=models.CASCADE,
        related_name="user_progress",
        verbose_name="Entrada",
    )
    mastery_level = models.SmallIntegerField(
        choices=MasteryLevel.choices,
        default=MasteryLevel.SEEN,
        verbose_name="Nivel de dominio",
    )
    review_count = models.PositiveSmallIntegerField(
        default=0,
        verbose_name="Veces practicada",
    )
    next_review_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Próxima revisión (SRS)",
    )
    last_seen_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "entry")
        verbose_name = "Progreso de vocabulario"
        verbose_name_plural = "Progresos de vocabulario"

    def __str__(self):
        return f"{self.user} → {self.entry} (nivel {self.mastery_level})"
