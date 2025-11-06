from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.notifications"

    def ready(self):
        # importa signals para registrar los receivers
        import apps.notifications.signals  # noqa: F401
