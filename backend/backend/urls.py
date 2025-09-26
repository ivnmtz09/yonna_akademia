from django.contrib import admin
from django.urls import path, include
from users.views import UserDetailsView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Endpoints de autenticación
    path("api/auth/", include("dj_rest_auth.urls")),  
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/user/", UserDetailsView.as_view(), name="user-detail"), 

    # Tus apps
    path("api/", include("courses.urls")),
    path("api/", include("quizzes.urls")),
    path("api/", include("progress.urls")),
    path("api/", include("media_content.urls")),
]
