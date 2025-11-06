from django.contrib import admin
from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "level_required", "created_by", "is_active", "created_at")
    list_filter = ("level_required", "is_active")
    search_fields = ("title", "description")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "progress", "enrolled_at")
    search_fields = ("user__email", "course__title")
    list_filter = ("course__level_required",)
