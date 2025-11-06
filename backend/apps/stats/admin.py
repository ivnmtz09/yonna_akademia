from django.contrib import admin
from .models import XpHistory


@admin.register(XpHistory)
class XpHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "xp_gained", "source", "created_at")
    list_filter = ("source",)
    search_fields = ("user__email",)
