from django.contrib import admin
from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'level_required', 'difficulty', 'is_active', 'created_by', 'created_at')
    list_filter = ('level_required', 'difficulty', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'created_by__email')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('is_active',)
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'description', 'level_required', 'is_active')
        }),
        ('Detalles Adicionales', {
            'fields': ('thumbnail', 'estimated_duration', 'difficulty')
        }),
        ('Metadatos', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress', 'course_completed', 'enrolled_at')
    list_filter = ('course_completed', 'enrolled_at', 'course')
    search_fields = ('user__email', 'course__title')
    readonly_fields = ('enrolled_at', 'last_accessed', 'completed_at')
    
    fieldsets = (
        ('Información de Inscripción', {
            'fields': ('user', 'course')
        }),
        ('Progreso', {
            'fields': ('progress', 'course_completed', 'completed_at')
        }),
        ('Fechas', {
            'fields': ('enrolled_at', 'last_accessed')
        }),
    )