from django.apps import AppConfig


class MediaContentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.media_content'
    verbose_name = "Contenido Multimedia"

    def ready(self):
        import apps.media_content.signals