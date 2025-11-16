from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Rutas de autenticación (usuarios, login y registro)
    path("api/auth/", include("apps.users.urls")),

    # JWT directo
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # Otras apps
    path("api/courses/", include("apps.courses.urls")),
    path("api/quizzes/", include("apps.quizzes.urls")),
    path("api/progress/", include("apps.progress.urls")),
    path("api/media/", include("apps.media_content.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/stats/", include("apps.stats.urls")),
]

# Servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)