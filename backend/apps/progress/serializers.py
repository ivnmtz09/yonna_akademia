from rest_framework import serializers
from .models import Progress
from apps.courses.serializers import CourseSerializer


class ProgressSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Progress
        fields = [
            "id", "course", "completed_quizzes", "total_quizzes",
            "percentage", "xp_earned", "updated_at"
        ]
        read_only_fields = fields
