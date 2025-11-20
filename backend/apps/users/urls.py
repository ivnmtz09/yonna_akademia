from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    CurrentUserView,
    LoginView,
    GoogleAuthView,
    AddXPView,
    UserListView,
    UserRoleUpdateView,
    logout_view,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    # Autenticación básica
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", logout_view, name="logout"),
    
    # Perfil y usuario actual
    path("profile/", ProfileView.as_view(), name="profile"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    
    # Gestión de usuarios (nuevas - para admin/moderator)
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/role/", UserRoleUpdateView.as_view(), name="user-role-update"),
    
    # Sistema de XP
    path("add-xp/", AddXPView.as_view(), name="add-xp"),
    
    # Autenticación JWT
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    
    # Autenticación social
    path("google/", GoogleAuthView.as_view(), name="google_auth"),
]