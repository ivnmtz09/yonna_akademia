from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile # Importamos el modelo Profile

User = get_user_model()


# ------------------------------
# SERIALIZER DE PERFIL (Modelo Profile)
# ------------------------------
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        # Campos que SÍ están en Profile (avatar, telefono, gustos, etc.)
        fields = [
            'avatar', 'telefono', 'gustos', 
            'fecha_nacimiento', 'localidad',
        ]
        read_only_fields = fields


# ------------------------------
# SERIALIZER DE USUARIO (USADO POR /api/auth/me/, /profile/, /users/)
# ------------------------------
class UserSerializer(serializers.ModelSerializer):
    # CRÍTICO: Anidamos el perfil. Usamos source='perfil' (related_name) 
    # y el nombre 'profile' para que coincida con el user_model.dart de Flutter.
    profile = ProfileSerializer(source='perfil', read_only=True) 
    
    # Campo de solo lectura para el nombre completo
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "role",
            "level", "xp", # <--- CRÍTICO para progreso en Flutter
            "first_name", "last_name",
            "bio", # <--- MANTENEMOS BIO AQUÍ (está en el modelo User)
            "full_name",
            "date_joined",
            "last_login",
            "profile" # <--- Incluimos el objeto Profile anidado
        ]
        read_only_fields = ["id", "level", "xp", "role", "date_joined", "last_login", "full_name"]


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
        # El campo 'username' está en tu modelo, por lo que lo creamos aquí
        username = f'{validated_data["first_name"]} {validated_data["last_name"]}'.strip()
        
        user = User.objects.create(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=username, # Agregamos username
            role="user", 
        )
        user.set_password(validated_data["password1"])
        user.save()
        return user


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
        
        # Usamos UserSerializer para obtener todos los campos (incluido 'profile') de forma segura
        user_data = UserSerializer(user).data
        
        response_data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        # Fusionamos los datos del usuario con los tokens
        response_data.update(user_data) 
        
        return response_data


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
        
        # Llamamos al método add_xp del modelo User (asumiendo que existe)
        if hasattr(user, 'add_xp') and callable(user.add_xp):
            user.add_xp(xp_amount)
        else:
             user.xp += xp_amount
             user.save()
        
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