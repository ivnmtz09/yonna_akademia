from django.contrib import admin
from django.urls import path, include
from users.views import UserDetailsView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT Authentication endpoints
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/verify/", TokenVerifyView.as_view(), name="token_verify"),
    
    # dj-rest-auth endpoints (para registro)
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/user/", UserDetailsView.as_view(), name="user-detail"), 

    # Tus apps
    path("api/", include("courses.urls")),
    path("api/", include("quizzes.urls")),
    path("api/", include("progress.urls")),
    path("api/", include("media_content.urls")),
]