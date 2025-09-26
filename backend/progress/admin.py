from django.contrib import admin
from .models import CourseProgress, LessonProgress, QuizProgress

@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "progress_percent", "completed", "updated_at")
    list_filter = ("completed", "updated_at")


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "completed", "updated_at")
    list_filter = ("completed", "updated_at")


@admin.register(QuizProgress)
class QuizProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "score", "completed", "completed_at")
    list_filter = ("completed", "completed_at")
