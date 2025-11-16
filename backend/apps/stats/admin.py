from django.contrib import admin
from .models import XpHistory, UserStatistic, PlatformStatistic


@admin.register(XpHistory)
class XpHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "xp_gained", "source", "related_quiz", "related_course", "created_at")
    list_filter = ("source", "created_at")
    search_fields = ("user__email", "description")
    readonly_fields = ("created_at",)
    list_select_related = ("user", "related_quiz", "related_course")
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('user', 'xp_gained', 'source', 'description')
        }),
        ('Relaciones', {
            'fields': ('related_quiz', 'related_course')
        }),
        ('Metadatos', {
            'fields': ('created_at',)
        }),
    )


@admin.register(UserStatistic)
class UserStatisticAdmin(admin.ModelAdmin):
    list_display = ("user", "total_xp_earned", "total_courses_completed", "current_streak_days", "updated_at")
    list_filter = ("updated_at",)
    search_fields = ("user__email",)
    readonly_fields = ("updated_at",)
    list_select_related = ("user",)
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Estadísticas de Quizzes', {
            'fields': (
                'total_quizzes_attempted', 'total_quizzes_passed', 
                'average_quiz_score'
            )
        }),
        ('Estadísticas de Cursos', {
            'fields': ('total_courses_started', 'total_courses_completed')
        }),
        ('Actividad y Rachas', {
            'fields': (
                'total_study_time_minutes', 'current_streak_days', 
                'longest_streak_days', 'last_active_date', 'days_active'
            )
        }),
        ('XP y Progreso', {
            'fields': ('total_xp_earned',)
        }),
        ('Metadatos', {
            'fields': ('updated_at',)
        }),
    )


@admin.register(PlatformStatistic)
class PlatformStatisticAdmin(admin.ModelAdmin):
    list_display = ("date", "total_users", "active_users_today", "total_quizzes_taken", "total_xp_gained")
    list_filter = ("date",)
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Fecha', {
            'fields': ('date',)
        }),
        ('Métricas de Usuarios', {
            'fields': ('total_users', 'new_users_today', 'active_users_today')
        }),
        ('Actividad', {
            'fields': (
                'total_quizzes_taken', 'total_xp_gained', 
                'total_courses_started', 'total_courses_completed'
            )
        }),
        ('Engagement', {
            'fields': ('average_session_time', 'average_user_level')
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at')
        }),
    )