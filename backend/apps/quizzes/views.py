from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Quiz, QuizAttempt
from .serializers import QuizSerializer, QuizAttemptSerializer


class AvailableQuizzesView(generics.ListAPIView):
    """Lista los quizzes disponibles para el nivel del estudiante."""
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filtra los quizzes cuyos cursos estén desbloqueados para el usuario
        return Quiz.objects.filter(course__level_required__lte=user.level)


class CreateQuizView(generics.CreateAPIView):
    """Permite al sabedor crear un nuevo quiz."""
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != "teacher":
            raise PermissionError("Solo los sabedores pueden crear quizzes.")
        serializer.save(created_by=self.request.user)


class QuizAttemptView(generics.CreateAPIView):
    """Permite al estudiante enviar su resultado de un quiz y ganar XP automáticamente."""
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        attempt = serializer.save()

        return Response({
            "message": "Intento registrado correctamente.",
            "quiz": attempt.quiz.title,
            "score": attempt.score,
            "passed": attempt.passed,
            "xp_gained": attempt.quiz.xp_reward if attempt.passed else 0,
            "current_level": request.user.level,
            "total_xp": request.user.xp
        }, status=status.HTTP_201_CREATED)
