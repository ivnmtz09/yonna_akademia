from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.contrib.auth import get_user_model
from .models import User, Profile

User = get_user_model()

# --- FORMULARIOS PERSONALIZADOS ---

class CustomUserCreationForm(forms.ModelForm):
    """Formulario para crear usuarios desde el panel de administración."""
    password1 = forms.CharField(label="Contraseña", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirmar contraseña", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "role", "level", "xp")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    """Formulario para editar usuarios existentes desde admin."""
    password = ReadOnlyPasswordHashField(
        label="Contraseña",
        help_text=(
            "Las contraseñas sin formato no se almacenan, por lo que no hay forma de ver esta contraseña, "
            "pero puedes cambiarla usando <a href=\"../password/\">este formulario</a>."
        )
    )

    class Meta:
        model = User
        fields = (
            "email", "first_name", "last_name", "role", "bio",
            "level", "xp", "is_active", "is_staff", "is_superuser",
            "groups", "user_permissions",
        )


# --- ADMIN PERSONALIZADO ---

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Configuración del panel de administración para el modelo User."""

    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    list_display = (
        "id", "email", "first_name", "last_name",
        "role", "level", "xp", "is_active", "is_staff"
    )
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Información personal", {"fields": ("first_name", "last_name", "bio")}),
        ("Progreso del usuario", {"fields": ("level", "xp")}),
        ("Roles y permisos", {
            "fields": (
                "role",
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Fechas importantes", {"fields": ("last_login", "date_joined")}),
    )

    readonly_fields = ("last_login", "date_joined")

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "first_name",
                "last_name",
                "role",
                "level",
                "xp",
                "password1",
                "password2",
                "is_staff",
                "is_superuser",
            ),
        }),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Configuración del panel de administración para los perfiles de usuario."""
    list_display = ("usuario", "localidad", "telefono", "creado")
    search_fields = ("usuario__email", "localidad", "telefono")
    readonly_fields = ("creado", "actualizado")
