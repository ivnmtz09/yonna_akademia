from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    UserDetailView,
    LoginView,
    GoogleAuthView,
    AddXPView,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("me/", UserDetailView.as_view(), name="user-detail"),
    path("add-xp/", AddXPView.as_view(), name="add-xp"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("google/", GoogleAuthView.as_view(), name="google_auth"),
]
