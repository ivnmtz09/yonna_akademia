from rest_framework import serializers
from .models import Progress, GlobalProgress
from apps.courses.serializers import CourseSerializer


class ProgressSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    remaining_quizzes = serializers.ReadOnlyField()
    estimated_completion_time = serializers.ReadOnlyField()
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_difficulty = serializers.CharField(source='course.difficulty', read_only=True)

    class Meta:
        model = Progress
        fields = [
            "id", "course", "course_title", "course_difficulty",
            "completed_quizzes", "total_quizzes", "remaining_quizzes",
            "percentage", "xp_earned", "course_completed", "completed_at",
            "streak_days", "estimated_completion_time", "updated_at"
        ]
        read_only_fields = fields


class GlobalProgressSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_level = serializers.IntegerField(source='user.level', read_only=True)
    user_xp = serializers.IntegerField(source='user.xp', read_only=True)
    completion_rate = serializers.SerializerMethodField()

    class Meta:
        model = GlobalProgress
        fields = [
            "id", "user_name", "user_level", "user_xp",
            "total_courses_enrolled", "total_courses_completed", 
            "total_quizzes_completed", "total_xp_earned",
            "average_progress", "completion_rate",
            "current_streak", "longest_streak", "updated_at"
        ]
        read_only_fields = fields

    def get_completion_rate(self, obj):
        if obj.total_courses_enrolled > 0:
            return (obj.total_courses_completed / obj.total_courses_enrolled) * 100
        return 0.0


class ProgressUpdateSerializer(serializers.Serializer):
    course_id = serializers.IntegerField(required=False)

    def validate_course_id(self, value):
        from apps.courses.models import Course
        try:
            course = Course.objects.get(id=value)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Curso no encontrado")
        return value


class LeaderboardSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    user_name = serializers.CharField()
    user_level = serializers.IntegerField()
    user_xp = serializers.IntegerField()
    total_courses_completed = serializers.IntegerField()
    total_quizzes_completed = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    rank = serializers.IntegerField()