from django.contrib import admin
from .models import Progress


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "percentage", "xp_earned", "updated_at")
    search_fields = ("user__email", "course__title")
    list_filter = ("course__level_required",)
