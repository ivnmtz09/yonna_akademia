from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    LoginSerializer,
    XPUpdateSerializer,
)
from .models import Profile
from .google_auth import google_authenticate

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
            return Response({"error": "Token de Google no proporcionado."}, status=status.HTTP_400_BAD_REQUEST)

        user, tokens = google_authenticate(id_token_str)
        if not user:
            return Response({"error": "Token de Google inválido."}, status=status.HTTP_400_BAD_REQUEST)

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
