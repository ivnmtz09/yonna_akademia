from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    LoginSerializer,
    XPUpdateSerializer,
    UserRoleUpdateSerializer,
)
from .models import Profile
from .google_auth import google_authenticate
from .permissions import IsAdmin, IsAdminOrModerator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

User = get_user_model()


# ------------------------------
# REGISTRO
# ------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ------------------------------
# LOGIN
# ------------------------------
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = serializer.save()
        return Response(tokens)


# ------------------------------
# PERFIL
# ------------------------------
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil


# ------------------------------
# DETALLE DE USUARIO
# ------------------------------
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# ------------------------------
# LISTA DE USUARIOS (solo admin/moderator)
# ------------------------------
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrModerator]


# ------------------------------
# ACTUALIZAR ROL DE USUARIO (solo admin)
# ------------------------------
class UserRoleUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRoleUpdateSerializer
    permission_classes = [IsAdmin]


# ------------------------------
# SUMAR XP
# ------------------------------
class AddXPView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = XPUpdateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "XP actualizada correctamente.",
                "level": user.level,
                "xp": user.xp,
            },
            status=status.HTTP_200_OK,
        )


# ------------------------------
# AUTENTICACIÓN CON GOOGLE
# ------------------------------
class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        id_token_str = request.data.get("id_token")
        if not id_token_str:
            return Response(
                {"error": "Token de Google no proporcionado."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user, tokens = google_authenticate(id_token_str)
        if not user:
            return Response(
                {"error": "Token de Google inválido."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "access": tokens["access"],
                "refresh": tokens["refresh"],
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "level": user.level,
                "xp": user.xp,
            },
            status=status.HTTP_200_OK,
        )


# ------------------------------
# LOGOUT
# ------------------------------
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Cierra la sesión del usuario invalidando el refresh token.
    """
    try:
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {"error": "Se requiere el refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Invalidar el token (requiere SimpleJWT con blacklist)
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response(
            {"message": "Sesión cerrada exitosamente."},
            status=status.HTTP_200_OK
        )
    
    except TokenError as e:
        return Response(
            {"error": "Token inválido o ya expirado."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error en logout_view: {str(e)}", exc_info=True)
        
        return Response(
            {"error": "Error al cerrar sesión."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user