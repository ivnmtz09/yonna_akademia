from rest_framework import viewsets
from .models import Quiz, Question, Answer, QuizResult
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer, QuizResultSerializer
from users.permissions import IsTeacherOrReadOnly, IsStudent, IsAdmin

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsTeacherOrReadOnly]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsTeacherOrReadOnly]


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsTeacherOrReadOnly]


class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [IsStudent | IsAdmin]
