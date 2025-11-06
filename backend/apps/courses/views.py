from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer


class AvailableCoursesView(generics.ListAPIView):
    """
    Lista los cursos disponibles para el estudiante,
    filtrados por su nivel actual.
    """
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(level_required__lte=user.level, is_active=True)


class CreateCourseView(generics.CreateAPIView):
    """
    Permite a un sabedor/docente crear nuevos cursos.
    """
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != "teacher":
            raise PermissionError("Solo los sabedores/docentes pueden crear cursos.")
        serializer.save(created_by=self.request.user)


class EnrollCourseView(generics.CreateAPIView):
    """
    Inscribe a un estudiante en un curso disponible.
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response({"error": "Debe proporcionar un ID de curso."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Curso no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if course.level_required > request.user.level:
            return Response({"error": "Tu nivel actual no te permite acceder a este curso."},
                            status=status.HTTP_403_FORBIDDEN)

        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)

        if not created:
            return Response({"message": "Ya estás inscrito en este curso."}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
