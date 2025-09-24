from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Extra", {"fields": ("role", "level", "bio")}),
    )
    list_display = ("username", "email", "role", "level", "is_staff")
    list_filter = ("role", "level", "is_staff", "is_superuser", "is_active")
    