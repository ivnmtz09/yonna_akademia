from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Progress
from .serializers import ProgressSerializer
from apps.courses.models import Course


class UserProgressView(generics.ListAPIView):
    """Devuelve el progreso de todos los cursos en los que el usuario está inscrito."""
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        courses = Course.objects.filter(enrollments__user=user)
        # Actualiza o crea progreso para cada curso inscrito
        for course in courses:
            progress, _ = Progress.objects.get_or_create(user=user, course=course)
            progress.update_progress()
        return Progress.objects.filter(user=user)


class CourseProgressView(generics.RetrieveAPIView):
    """Muestra el progreso del usuario en un curso específico."""
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        course_id = self.kwargs.get("course_id")
        progress, _ = Progress.objects.get_or_create(user=user, course_id=course_id)
        progress.update_progress()
        return progress
