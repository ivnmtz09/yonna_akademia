from rest_framework import viewsets
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer
from apps.users.permissions import IsTeacher, IsAdmin

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsTeacher]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsTeacher]
