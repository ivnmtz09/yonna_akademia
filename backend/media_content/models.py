from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class MediaContent(models.Model):
    MEDIA_TYPES = [
        ("audio", "Audio"),
        ("video", "Video"),
        ("image", "Image"),
        ("document", "Document"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES)
    file = models.FileField(upload_to="media_content/")
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploaded_media")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.media_type})"
