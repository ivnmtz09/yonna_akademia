from rest_framework import viewsets
from .models import CourseProgress, LessonProgress, QuizProgress
from .serializers import CourseProgressSerializer, LessonProgressSerializer, QuizProgressSerializer
from users.permissions import IsStudent, IsAdmin, IsTeacher

class CourseProgressViewSet(viewsets.ModelViewSet):
    queryset = CourseProgress.objects.all()
    serializer_class = CourseProgressSerializer
    permission_classes = [IsStudent | IsTeacher | IsAdmin]


class LessonProgressViewSet(viewsets.ModelViewSet):
    queryset = LessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    permission_classes = [IsStudent | IsTeacher | IsAdmin]


class QuizProgressViewSet(viewsets.ModelViewSet):
    queryset = QuizProgress.objects.all()
    serializer_class = QuizProgressSerializer
    permission_classes = [IsStudent | IsTeacher | IsAdmin]
