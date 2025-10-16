from rest_framework import viewsets
from .models import Quiz, Question, Answer, QuizResult
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer, QuizResultSerializer
from apps.users.permissions import IsTeacher, IsStudent, IsAdmin

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsTeacher]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsTeacher]


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsTeacher]


class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [IsStudent | IsAdmin]
