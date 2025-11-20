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
    UserDetailView,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

# Definición de rutas específicas para el módulo de usuarios
urlpatterns = [
    # Autenticación básica
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", logout_view, name="logout"),
    
    # Perfil y usuario actual
    path("profile/", ProfileView.as_view(), name="profile"), # GET y PUT/PATCH
    path("me/", CurrentUserView.as_view(), name="current-user"), # GET
    
    # --- GESTIÓN DE USUARIOS (Administración) ---
    path("users/", UserListView.as_view(), name="user-list"), # GET (Admin/Moderator)
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"), # GET
    path("users/<int:pk>/role/", UserRoleUpdateView.as_view(), name="user-role-update"), # PATCH (Admin)
    
    # Sistema de XP/Niveles
    path("add-xp/", AddXPView.as_view(), name="add-xp"),
    
    # Autenticación JWT
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    
    # Autenticación social
    path("google/", GoogleAuthView.as_view(), name="google_auth"),
]