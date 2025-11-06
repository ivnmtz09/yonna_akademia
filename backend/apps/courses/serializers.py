from rest_framework import serializers
from .models import Course, Enrollment


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title", "description", "level_required", "is_active", "created_by", "created_at"]
        read_only_fields = ["id", "created_by", "created_at"]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "course", "progress", "enrolled_at"]
        read_only_fields = ["id", "enrolled_at"]
