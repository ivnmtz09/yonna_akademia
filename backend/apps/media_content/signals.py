from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.files import File
from PIL import Image
import os
from .models import MediaContent


@receiver(post_save, sender=MediaContent)
def generate_thumbnail(sender, instance, created, **kwargs):
    """Generar thumbnail automáticamente para imágenes y videos."""
    if created and instance.media_type in ['image', 'video'] and not instance.thumbnail:
        try:
            if instance.media_type == 'image' and instance.file:
                # Para imágenes, crear thumbnail desde la imagen
                img = Image.open(instance.file.path)
                img.thumbnail((300, 300))
                
                # Guardar thumbnail
                thumb_path = f"media_thumbnails/{instance.file.name.split('/')[-1]}_thumb.jpg"
                img.save(thumb_path, 'JPEG')
                
                with open(thumb_path, 'rb') as thumb_file:
                    instance.thumbnail.save(
                        f"{instance.file.name.split('/')[-1]}_thumb.jpg",
                        File(thumb_file),
                        save=True
                    )
                
                # Limpiar archivo temporal
                os.remove(thumb_path)
                
        except Exception as e:
            # Log error pero no romper el flujo
            print(f"Error generando thumbnail: {e}")