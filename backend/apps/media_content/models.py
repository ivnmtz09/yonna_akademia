from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


class MediaContent(models.Model):
    MEDIA_TYPES = [
        ("audio", "Audio"),
        ("video", "Video"),
        ("image", "Imagen"),
        ("document", "Documento"),
    ]
    
    CATEGORY_CHOICES = [
        ("cultural", "Cultural Wayuu"),
        ("educational", "Educativo"),
        ("language", "Enseñanza de Idioma"),
        ("music", "Música Tradicional"),
        ("crafts", "Artesanías"),
        ("stories", "Historias y Leyendas"),
        ("cooking", "Gastronomía"),
        ("other", "Otro"),
    ]

    title = models.CharField(max_length=255, verbose_name="título")
    description = models.TextField(blank=True, null=True, verbose_name="descripción")
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES, verbose_name="tipo de medio")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="cultural", verbose_name="categoría")
    
    # Campos de archivo con validaciones
    file = models.FileField(
        upload_to="media_content/%Y/%m/%d/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp',  # Imágenes
                    'mp4', 'avi', 'mov', 'wmv', 'webm',  # Videos
                    'mp3', 'wav', 'ogg', 'm4a',  # Audio
                    'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'  # Documentos
                ]
            )
        ],
        verbose_name="archivo"
    )
    
    # Metadatos del archivo
    file_size = models.PositiveIntegerField(blank=True, null=True, verbose_name="tamaño del archivo (bytes)")
    duration = models.PositiveIntegerField(blank=True, null=True, help_text="Duración en segundos (para audio/video)")
    thumbnail = models.ImageField(
        upload_to="media_thumbnails/%Y/%m/%d/", 
        blank=True, 
        null=True,
        verbose_name="miniatura"
    )
    
    # Información de derechos y atribución
    attribution = models.CharField(max_length=255, blank=True, null=True, verbose_name="atribución")
    license = models.CharField(
        max_length=100,
        default="educational",
        choices=[
            ("educational", "Uso Educativo"),
            ("creative_commons", "Creative Commons"),
            ("all_rights_reserved", "Todos los derechos reservados"),
        ],
        verbose_name="licencia"
    )
    
    # Campos de moderación
    is_approved = models.BooleanField(default=False, verbose_name="aprobado")
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_media",
        verbose_name="aprobado por"
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name="fecha de aprobación")
    
    # Campos de visibilidad
    is_featured = models.BooleanField(default=False, verbose_name="destacado")
    is_public = models.BooleanField(default=True, verbose_name="público")
    
    # Metadata
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_media",
        verbose_name="subido por"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="fecha de subida")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="fecha de actualización")
    
    # Tags para búsqueda
    tags = models.JSONField(default=list, blank=True, help_text="Etiquetas para búsqueda")

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "contenido multimedia"
        verbose_name_plural = "contenidos multimedia"
        indexes = [
            models.Index(fields=['media_type', 'is_approved', 'is_public']),
            models.Index(fields=['category', 'is_approved']),
            models.Index(fields=['is_featured', 'uploaded_at']),
            models.Index(fields=['uploaded_by', 'uploaded_at']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_media_type_display()})"

    def save(self, *args, **kwargs):
        # Calcular tamaño del archivo al guardar
        if self.file and not self.file_size:
            self.file_size = self.file.size
        
        # Si es aprobado por primera vez, registrar quién y cuándo
        if self.is_approved and not self.approved_at:
            from django.utils import timezone
            self.approved_at = timezone.now()
        
        super().save(*args, **kwargs)

    @property
    def file_size_mb(self):
        """Tamaño del archivo en MB."""
        if self.file_size:
            return round(self.file_size / (1024 * 1024), 2)
        return 0

    @property
    def formatted_duration(self):
        """Duración formateada para audio/video."""
        if self.duration:
            minutes = self.duration // 60
            seconds = self.duration % 60
            return f"{minutes}:{seconds:02d}"
        return None

    @property
    def download_url(self):
        """URL para descargar el archivo."""
        return self.file.url

    @property
    def preview_url(self):
        """URL para previsualizar (thumbnail o archivo)."""
        if self.thumbnail:
            return self.thumbnail.url
        elif self.media_type == 'image':
            return self.file.url
        return None


class MediaCollection(models.Model):
    """Colecciones de contenido multimedia."""
    title = models.CharField(max_length=255, verbose_name="título")
    description = models.TextField(blank=True, null=True, verbose_name="descripción")
    media_files = models.ManyToManyField(
        MediaContent, 
        related_name="collections",
        blank=True,
        verbose_name="archivos multimedia"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_collections",
        verbose_name="creado por"
    )
    is_public = models.BooleanField(default=True, verbose_name="público")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="fecha de actualización")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "colección multimedia"
        verbose_name_plural = "colecciones multimedia"

    def __str__(self):
        return self.title

    @property
    def media_count(self):
        return self.media_files.count()


class MediaView(models.Model):
    """Registro de visualizaciones de contenido multimedia."""
    media = models.ForeignKey(
        MediaContent,
        on_delete=models.CASCADE,
        related_name="views",
        verbose_name="contenido multimedia"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="media_views",
        verbose_name="usuario"
    )
    viewed_at = models.DateTimeField(auto_now_add=True, verbose_name="fecha de visualización")
    duration_watched = models.PositiveIntegerField(default=0, help_text="Duración vista en segundos")

    class Meta:
        ordering = ["-viewed_at"]
        indexes = [
            models.Index(fields=['media', 'viewed_at']),
            models.Index(fields=['user', 'viewed_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.media.title}"