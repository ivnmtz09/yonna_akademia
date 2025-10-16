from rest_framework.views import APIView
from rest_framework import status
from .google_auth import google_authenticate
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, LoginSerializer
from .models import Profile

User = get_user_model()


# ------------------------------
# REGISTRO
# ------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ------------------------------
# LOGIN PERSONALIZADO
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
# PERFIL Y DETALLE DE USUARIO
# ------------------------------
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

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
            },
            status=status.HTTP_200_OK,
        )
