from rest_framework import serializers
from .models import Course, Enrollment
from apps.quizzes.models import Quiz


class CourseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    enrolled_students_count = serializers.ReadOnlyField()
    completed_students_count = serializers.ReadOnlyField()
    is_enrolled = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()
    quiz_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "level_required", "is_active",
            "thumbnail", "estimated_duration", "difficulty",
            "created_by", "created_by_name", "created_at", "updated_at",
            "enrolled_students_count", "completed_students_count",
            "is_enrolled", "user_progress", "quiz_count"
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            enrollment = obj.enrollments.filter(user=request.user).first()
            return enrollment.progress if enrollment else 0.0
        return 0.0

    def get_quiz_count(self, obj):
        return Quiz.objects.filter(course=obj, is_active=True).count()


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_level = serializers.IntegerField(source='course.level_required', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id", "course", "course_title", "course_level", 
            "progress", "course_completed", "completed_at",
            "enrolled_at", "last_accessed"
        ]
        read_only_fields = ["id", "enrolled_at", "last_accessed"]


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "title", "description", "level_required", 
            "thumbnail", "estimated_duration", "difficulty"
        ]

    def validate_level_required(self, value):
        if value < 1 or value > 10:
            raise serializers.ValidationError("El nivel requerido debe estar entre 1 y 10")
        return value


class EnrollCourseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()

    def validate_course_id(self, value):
        try:
            course = Course.objects.get(id=value, is_active=True)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Curso no encontrado o inactivo")
        return value