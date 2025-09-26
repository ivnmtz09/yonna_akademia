from django.contrib import admin
from .models import Course, Lesson

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "teacher", "created_at")
    search_fields = ("title", "description", "teacher__username")
    list_filter = ("created_at",)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "created_at")
    search_fields = ("title", "content")
    list_filter = ("course", "created_at")
