from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

# Importaciones locales
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer, # Necesaria para la actualización
    LoginSerializer,
    XPUpdateSerializer,
    UserRoleUpdateSerializer,
)
from .google_auth import google_authenticate # Asumimos que esta función existe
from .permissions import IsAdmin, IsAdminOrModerator

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
        # Retorna el diccionario con tokens y datos de usuario (incluido 'profile')
        response_data = serializer.save() 
        return Response(response_data)


# ------------------------------
# PERFIL (GET/PUT/PATCH /api/auth/profile/)
# ------------------------------
class ProfileView(generics.RetrieveUpdateAPIView):
    # Usamos UserSerializer para la lectura y respuesta
    serializer_class = UserSerializer 
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Devuelve el objeto User actual
        return self.request.user
    
    # Manejo de actualización (PUT/PATCH)
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        
        # 1. Separar datos de User y datos de Profile
        user_data = {}
        profile_data = {}
        
        # Identificar qué campos pertenecen a User vs Profile
        user_fields = [f.name for f in User._meta.fields]
        profile_fields = [f.name for f in user.perfil._meta.fields]

        for key, value in request.data.items():
            if key in user_fields:
                user_data[key] = value
            elif key in profile_fields:
                profile_data[key] = value

        # 2. Actualizar User (si hay datos)
        if user_data:
            user_serializer = UserSerializer(user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        
        # 3. Actualizar Profile (si hay datos)
        if profile_data:
            profile = user.perfil # Usamos el related_name 'perfil'
            profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        # 4. Devolver el objeto de usuario completo y actualizado
        return Response(UserSerializer(user).data)


# ------------------------------
# USUARIO ACTUAL (GET /api/auth/me/)
# ------------------------------
class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ------------------------------
# DETALLE DE USUARIO (Para /users/<id>/)
# ------------------------------
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# ------------------------------
# LISTA DE USUARIOS (Para /api/auth/users/)
# ------------------------------
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined') 
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrModerator]


# ------------------------------
# ACTUALIZAR ROL DE USUARIO (Para /users/<id>/role/)
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
        token = request.data.get('id_token')
        if not token:
            return Response({"error": "Falta el token de Google."}, status=status.HTTP_400_BAD_REQUEST)

        # Usamos la función importada de google_auth.py
        user, tokens = google_authenticate(token)
        
        if user and tokens:
            user_data = UserSerializer(user).data
            response_data = {
                "refresh": tokens["refresh"],
                "access": tokens["access"],
            }
            response_data.update(user_data)
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(
            {"error": "Autenticación de Google fallida o token inválido."}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


# ------------------------------
# LOGOUT
# ------------------------------
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Cierra la sesión del usuario invalidando el refresh token."""
    try:
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {"error": "Se requiere el refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response(
            {"message": "Sesión cerrada exitosamente."},
            status=status.HTTP_200_OK
        )
    
    except TokenError:
        return Response(
            {"error": "Token inválido o ya expirado."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except Exception as e:
        print(f"Error en logout_view: {str(e)}") 
        
        return Response(
            {"error": "Error al cerrar sesión."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )