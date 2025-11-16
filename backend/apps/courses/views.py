from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404

from .models import Course, Enrollment
from .serializers import (
    CourseSerializer, 
    EnrollmentSerializer, 
    CreateCourseSerializer,
    EnrollCourseSerializer
)
from apps.users.permissions import IsAdmin, IsModerator, IsAdminOrModerator


class AvailableCoursesView(generics.ListAPIView):
    """
    Lista los cursos disponibles para el usuario,
    filtrados por su nivel actual.
    """
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Para admin/moderator ven todos los cursos, para users solo los de su nivel
        if user.role in ['admin', 'moderator']:
            return Course.objects.filter(is_active=True).prefetch_related('enrollments')
        else:
            return Course.objects.filter(level_required__lte=user.level, is_active=True).prefetch_related('enrollments')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CourseDetailView(generics.RetrieveAPIView):
    """Detalle de un curso específico"""
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CreateCourseView(generics.CreateAPIView):
    """
    Permite a moderadores y admins crear nuevos cursos.
    """
    serializer_class = CreateCourseSerializer
    permission_classes = [IsAdminOrModerator]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class UpdateCourseView(generics.UpdateAPIView):
    """Actualizar curso existente"""
    serializer_class = CreateCourseSerializer
    permission_classes = [IsAdminOrModerator]
    queryset = Course.objects.all()

    def get_queryset(self):
        # Los moderadores solo pueden editar sus propios cursos
        if self.request.user.role == 'moderator':
            return Course.objects.filter(created_by=self.request.user)
        return Course.objects.all()


class EnrollCourseView(APIView):
    """
    Inscribe a un usuario en un curso disponible.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = EnrollCourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        course_id = serializer.validated_data['course_id']
        course = get_object_or_404(Course, id=course_id, is_active=True)

        # Verificar nivel del usuario (solo para usuarios regulares)
        if request.user.role == 'user' and course.level_required > request.user.level:
            return Response(
                {"error": "Tu nivel actual no te permite acceder a este curso."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Crear o obtener inscripción
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, 
            course=course
        )

        if not created:
            return Response(
                {"message": "Ya estás inscrito en este curso."}, 
                status=status.HTTP_200_OK
            )

        # Serializar respuesta
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserEnrollmentsView(generics.ListAPIView):
    """Lista los cursos en los que está inscrito el usuario"""
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user).select_related('course')


class CourseEnrollmentsView(generics.ListAPIView):
    """Lista las inscripciones de un curso (solo para admin/moderator)"""
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminOrModerator]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Enrollment.objects.filter(course_id=course_id).select_related('user')


class UpdateProgressView(APIView):
    """Actualizar progreso de un curso (se llama automáticamente al completar quizzes)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        course_id = request.data.get('course_id')
        enrollment = get_object_or_404(
            Enrollment, 
            user=request.user, 
            course_id=course_id
        )
        
        # Calcular progreso basado en quizzes
        progress = enrollment.calculate_progress_based_on_quizzes()
        
        return Response({
            "message": "Progreso actualizado",
            "progress": progress,
            "course_completed": enrollment.course_completed
        })


class CourseStatisticsView(APIView):
    """Estadísticas de cursos (solo admin/moderator)"""
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        stats = {
            'total_courses': Course.objects.filter(is_active=True).count(),
            'total_enrollments': Enrollment.objects.count(),
            'completed_enrollments': Enrollment.objects.filter(course_completed=True).count(),
            'average_progress': Enrollment.objects.aggregate(avg_progress=Avg('progress'))['avg_progress'] or 0,
            'popular_courses': Course.objects.filter(is_active=True).annotate(
                enrollment_count=Count('enrollments')
            ).order_by('-enrollment_count')[:5].values('id', 'title', 'enrollment_count')
        }
        return Response(stats)