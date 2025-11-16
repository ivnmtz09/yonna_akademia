from django.contrib import admin
from .models import Progress, GlobalProgress


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'percentage', 'course_completed', 'streak_days', 'updated_at')
    list_filter = ('course_completed', 'course', 'updated_at')
    search_fields = ('user__email', 'course__title')
    readonly_fields = ('updated_at', 'completed_at')
    list_select_related = ('user', 'course')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('user', 'course')
        }),
        ('Progreso', {
            'fields': (
                'completed_quizzes', 'total_quizzes', 'percentage', 
                'xp_earned', 'course_completed', 'completed_at'
            )
        }),
        ('Racha de Estudio', {
            'fields': ('streak_days', 'last_study_date')
        }),
        ('Metadatos', {
            'fields': ('updated_at',)
        }),
    )


@admin.register(GlobalProgress)
class GlobalProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_courses_completed', 'total_xp_earned', 'current_streak', 'updated_at')
    list_filter = ('updated_at',)
    search_fields = ('user__email',)
    readonly_fields = ('updated_at',)
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Estadísticas Globales', {
            'fields': (
                'total_courses_enrolled', 'total_courses_completed',
                'total_quizzes_completed', 'total_xp_earned',
                'average_progress'
            )
        }),
        ('Rachas', {
            'fields': ('current_streak', 'longest_streak')
        }),
        ('Metadatos', {
            'fields': ('updated_at',)
        }),
    )