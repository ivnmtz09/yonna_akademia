import logging

from django.db.models import Count, Avg, Prefetch, Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.users.permissions import IsAdmin, IsModerator, IsAdminOrModerator
from apps.quizzes.models import Quiz, QuizAttempt

from .models import Course, Enrollment
from .serializers import (
    CourseSerializer,
    EnrollmentSerializer,
    CreateCourseSerializer,
    EnrollCourseSerializer,
)

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Throttle personalizado para endpoints de autenticación
# ──────────────────────────────────────────────────────────────────────────────

class AuthRateThrottle(AnonRateThrottle):
    """
    Límite de tasa estricto para endpoints sensibles (login, registro).
    Usa el scope 'auth' definido en REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'].
    """
    scope = "auth"


# ──────────────────────────────────────────────────────────────────────────────
# Helpers de queryset optimizado — select_related + prefetch_related
# ──────────────────────────────────────────────────────────────────────────────

def _optimized_course_queryset(user=None):
    """
    Queryset base de Course con todas las relaciones precargadas para evitar N+1.

    Relaciones:
      - select_related('created_by')  → JOIN 1:1 al usuario creador
      - prefetch_related('enrollments')  → enrollments del curso
      - Prefetch('quizzes', ...)  → solo quizzes activos, con sus preguntas
      - Prefetch('enrollments', to_attr='user_enrollment')  → enrollment del
        usuario actual, para is_enrolled / user_progress sin queries extra

    Resultado: una sola consulta de Course + 3 consultas adicionales
    (enrollments, quizzes, questions), independientemente del número de cursos.
    """
    quizzes_qs = (
        Quiz.objects
        .filter(is_active=True)
        .only("id", "title", "difficulty", "xp_reward", "passing_score")
        .prefetch_related("questions")
    )

    base_qs = (
        Course.objects
        .filter(is_active=True)
        .select_related("created_by")                      # FK → User
        .prefetch_related(
            Prefetch("quizzes", queryset=quizzes_qs),      # quizzes activos
            "enrollments",                                  # todos los enrollments
        )
        .annotate(
            enrollment_count=Count("enrollments", distinct=True),
            completed_count=Count(
                "enrollments",
                filter=Q(enrollments__course_completed=True),
                distinct=True,
            ),
            quiz_count_annotated=Count("quizzes", distinct=True),
        )
    )

    # Si se pasa el usuario, precarga solo SU enrollment para el serializer
    if user and user.is_authenticated:
        user_enrollment_qs = Enrollment.objects.filter(user=user)
        base_qs = base_qs.prefetch_related(
            Prefetch(
                "enrollments",
                queryset=user_enrollment_qs,
                to_attr="user_enrollment",
            )
        )

    return base_qs


# ──────────────────────────────────────────────────────────────────────────────
# Vistas
# ──────────────────────────────────────────────────────────────────────────────

@extend_schema(tags=["Cursos"])
class AvailableCoursesView(generics.ListAPIView):
    """
    Lista los cursos disponibles para el usuario, filtrados por su nivel.
    Usa select_related + prefetch_related para evitar el problema N+1.
    """
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = _optimized_course_queryset(user=user)
        if user.role not in ("admin", "moderator"):
            qs = qs.filter(level_required__lte=user.level)
        return qs.order_by('id')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


@extend_schema(tags=["Cursos"])
class CourseDetailView(generics.RetrieveAPIView):
    """Detalle de un curso específico con todas sus relaciones precargadas."""
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return _optimized_course_queryset(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


@extend_schema(tags=["Cursos"])
class CreateCourseView(generics.CreateAPIView):
    """Permite a moderadores y admins crear nuevos cursos."""
    serializer_class = CreateCourseSerializer
    permission_classes = [IsAdminOrModerator]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


@extend_schema(tags=["Cursos"])
class UpdateCourseView(generics.UpdateAPIView):
    """Actualizar curso existente."""
    serializer_class = CreateCourseSerializer
    permission_classes = [IsAdminOrModerator]

    def get_queryset(self):
        if self.request.user.role == "moderator":
            return Course.objects.filter(created_by=self.request.user)
        return Course.objects.all()


@extend_schema(tags=["Cursos"])
class EnrollCourseView(APIView):
    """Inscribe a un usuario en un curso disponible."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = EnrollCourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course_id = serializer.validated_data["course_id"]

        course = get_object_or_404(Course, id=course_id, is_active=True)
        user = request.user

        if user.role == "user" and course.level_required > user.level:
            return Response(
                {
                    "error": "Nivel insuficiente",
                    "detail": (
                        f"Se requiere nivel {course.level_required}. "
                        f"Tu nivel actual es {user.level}."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        enrollment, created = Enrollment.objects.get_or_create(
            user=user, course=course
        )

        if not created:
            return Response(
                {
                    "message": "Ya estás inscrito en este curso.",
                    "enrollment": EnrollmentSerializer(enrollment).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Inscripción exitosa",
                "enrollment": EnrollmentSerializer(enrollment).data,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Cursos"])
class UserEnrollmentsView(generics.ListAPIView):
    """Lista los cursos en los que está inscrito el usuario."""
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Enrollment.objects
            .filter(user=self.request.user)
            .select_related("course", "course__created_by")  # evita N+1 en course
            .order_by("-last_accessed")
        )


@extend_schema(tags=["Cursos"])
class CourseEnrollmentsView(generics.ListAPIView):
    """Lista las inscripciones de un curso (solo admin/moderator)."""
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminOrModerator]

    def get_queryset(self):
        return (
            Enrollment.objects
            .filter(course_id=self.kwargs["course_id"])
            .select_related("user")
        )


@extend_schema(tags=["Cursos"])
class UpdateProgressView(APIView):
    """Actualizar progreso de un curso basado en quizzes completados."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        enrollment = get_object_or_404(
            Enrollment, user=request.user, course_id=course_id
        )
        progress = enrollment.calculate_progress_based_on_quizzes()
        return Response(
            {
                "message": "Progreso actualizado",
                "progress": progress,
                "course_completed": enrollment.course_completed,
            }
        )


@extend_schema(tags=["Cursos"])
class CourseStatisticsView(APIView):
    """Estadísticas de cursos (solo admin/moderator)."""
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        # Una sola consulta con annotate en lugar de múltiples .count() separados
        popular_courses = list(
            Course.objects
            .filter(is_active=True)
            .annotate(enrollment_count=Count("enrollments"))
            .order_by("-enrollment_count")
            .values("id", "title", "enrollment_count")[:5]
        )
        stats = {
            "total_courses": Course.objects.filter(is_active=True).count(),
            "total_enrollments": Enrollment.objects.count(),
            "completed_enrollments": Enrollment.objects.filter(
                course_completed=True
            ).count(),
            "average_progress": (
                Enrollment.objects.aggregate(avg_progress=Avg("progress"))[
                    "avg_progress"
                ]
                or 0
            ),
            "popular_courses": popular_courses,
        }
        return Response(stats)