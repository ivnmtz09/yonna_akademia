from rest_framework import serializers

from apps.quizzes.models import Quiz
from .models import Course, Enrollment


class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer principal de Course.

    Usa los datos ya precargados por _optimized_course_queryset para evitar
    queries adicionales dentro del serializer (N+1).

    Campos computados:
      - enrolled_students_count → viene de la anotación enrollment_count
      - completed_students_count → viene de la anotación completed_count
      - quiz_count → viene de quiz_count_annotated
      - is_enrolled → busca en user_enrollment (to_attr del Prefetch)
      - user_progress → busca en user_enrollment (to_attr del Prefetch)
    """
    created_by_name = serializers.CharField(
        source="created_by.get_full_name", read_only=True
    )
    enrolled_students_count = serializers.IntegerField(
        source="enrollment_count", read_only=True
    )
    completed_students_count = serializers.IntegerField(
        source="completed_count", read_only=True
    )
    quiz_count = serializers.IntegerField(
        source="quiz_count_annotated", read_only=True
    )
    is_enrolled = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "level_required", "is_active",
            "thumbnail", "estimated_duration", "difficulty",
            "created_by", "created_by_name", "created_at", "updated_at",
            "enrolled_students_count", "completed_students_count",
            "is_enrolled", "user_progress", "quiz_count",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def get_is_enrolled(self, obj: Course) -> bool:
        """
        Lee user_enrollment (to_attr del Prefetch) si existe,
        así no lanza una query extra por cada curso en la lista.
        """
        user_enrollments = getattr(obj, "user_enrollment", None)
        if user_enrollments is not None:
            return len(user_enrollments) > 0

        # Fallback si el queryset no tiene el Prefetch aplicado
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False

    def get_user_progress(self, obj: Course) -> float:
        """Igual que get_is_enrolled: prioriza el to_attr."""
        user_enrollments = getattr(obj, "user_enrollment", None)
        if user_enrollments is not None:
            return user_enrollments[0].progress if user_enrollments else 0.0

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            enrollment = obj.enrollments.filter(user=request.user).first()
            return enrollment.progress if enrollment else 0.0
        return 0.0


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_level = serializers.IntegerField(
        source="course.level_required", read_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            "id", "course", "course_title", "course_level",
            "progress", "course_completed", "completed_at",
            "enrolled_at", "last_accessed",
        ]
        read_only_fields = ["id", "enrolled_at", "last_accessed"]


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "title", "description", "level_required",
            "thumbnail", "estimated_duration", "difficulty",
        ]

    def validate_level_required(self, value):
        if value < 1 or value > 10:
            raise serializers.ValidationError(
                "El nivel requerido debe estar entre 1 y 10."
            )
        return value


class EnrollCourseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()

    def validate_course_id(self, value):
        if not Course.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Curso no encontrado o inactivo.")
        return value