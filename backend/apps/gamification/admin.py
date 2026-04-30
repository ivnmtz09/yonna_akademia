from django.contrib import admin
from .models import Badge, UserBadge, Streak, XPTransaction


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ["name", "trigger", "threshold", "xp_reward", "is_active"]
    list_filter = ["trigger", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ["user", "badge", "earned_at"]
    list_filter = ["badge"]
    search_fields = ["user__email", "badge__name"]
    raw_id_fields = ["user", "badge"]


@admin.register(Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ["user", "current_streak", "longest_streak", "last_activity_date", "freeze_tokens"]
    search_fields = ["user__email"]
    raw_id_fields = ["user"]


@admin.register(XPTransaction)
class XPTransactionAdmin(admin.ModelAdmin):
    list_display = ["user", "amount", "reason", "reference_id", "created_at"]
    list_filter = ["reason"]
    search_fields = ["user__email"]
    raw_id_fields = ["user"]
    readonly_fields = ["created_at"]
