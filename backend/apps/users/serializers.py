from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile

User = get_user_model()


# ------------------------------
# SERIALIZER DE USUARIO
# ------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "username", "role", "bio",
            "level", "xp", "first_name", "last_name"
        ]
        read_only_fields = ["id", "level", "xp"]


# ------------------------------
# SERIALIZER DE REGISTRO
# ------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "password1", "password2")

    def validate(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=f'{validated_data["first_name"]} {validated_data["last_name"]}',
            role="user",  # Nuevo rol por defecto
        )
        user.set_password(validated_data["password1"])
        user.save()
        return user


# ------------------------------
# SERIALIZER DE PERFIL
# ------------------------------
class ProfileSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"


# ------------------------------
# SERIALIZER DE LOGIN
# ------------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError({"error": "Credenciales inválidas."})
        if not user.is_active:
            raise serializers.ValidationError({"error": "Esta cuenta está inactiva."})

        attrs["user"] = user
        return attrs

    def create(self, validated_data):
        user = validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "level": user.level,
            "xp": user.xp,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }


# ------------------------------
# SERIALIZER PARA SUMAR XP
# ------------------------------
class XPUpdateSerializer(serializers.Serializer):
    xp_amount = serializers.IntegerField(min_value=1)

    def validate_xp_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad de XP debe ser positiva.")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        xp_amount = self.validated_data["xp_amount"]
        user.add_xp(xp_amount)
        return user


# ------------------------------
# SERIALIZER PARA ACTUALIZAR ROL (solo admin)
# ------------------------------
class UserRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["role"]
        
    def validate_role(self, value):
        valid_roles = ["admin", "moderator", "user"]
        if value not in valid_roles:
            raise serializers.ValidationError(f"Rol inválido. Debe ser uno de: {', '.join(valid_roles)}")
        return value