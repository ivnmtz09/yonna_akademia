from django.contrib import admin
from .models import Quiz, Question, QuizAttempt


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ['text', 'question_type', 'options', 'correct_answer', 'explanation', 'order']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'difficulty', 'passing_score', 'xp_reward', 'is_active', 'created_by')
    list_filter = ('difficulty', 'is_active', 'created_at', 'course')
    search_fields = ('title', 'description', 'course__title')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('is_active',)
    inlines = [QuestionInline]
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'description', 'course', 'is_active')
        }),
        ('Configuración del Quiz', {
            'fields': ('difficulty', 'passing_score', 'xp_reward', 'time_limit', 'max_attempts')
        }),
        ('Metadatos', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz', 'question_type', 'order')
    list_filter = ('question_type', 'quiz__course')
    search_fields = ('text', 'quiz__title')
    raw_id_fields = ('quiz',)
    
    fieldsets = (
        ('Información de la Pregunta', {
            'fields': ('quiz', 'text', 'question_type', 'order')
        }),
        ('Respuestas', {
            'fields': ('options', 'correct_answer', 'explanation')
        }),
    )


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'passed', 'completed_at')
    list_filter = ('passed', 'completed_at', 'quiz')
    search_fields = ('user__email', 'quiz__title')
    readonly_fields = ('completed_at',)
    
    fieldsets = (
        ('Información del Intento', {
            'fields': ('user', 'quiz')
        }),
        ('Resultados', {
            'fields': ('score', 'passed', 'time_taken', 'answers')
        }),
        ('Fechas', {
            'fields': ('completed_at',)
        }),
    )