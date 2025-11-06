from django.contrib import admin
from .models import Quiz, Question, QuizAttempt


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 2


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "xp_reward", "passing_score", "created_by")
    search_fields = ("title", "course__title")
    list_filter = ("course__level_required",)
    inlines = [QuestionInline]


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "score", "passed", "completed_at")
    search_fields = ("user__email", "quiz__title")
    list_filter = ("passed",)
