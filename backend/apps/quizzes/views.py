from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404

from .models import Quiz, Question, QuizAttempt
from .serializers import (
    QuizSerializer,
    CreateQuizSerializer,
    QuizAttemptSerializer,
    SubmitQuizSerializer,
    QuizStatisticsSerializer,
)
from apps.users.permissions import IsAdmin, IsModerator, IsAdminOrModerator


class AvailableQuizzesView(generics.ListAPIView):
    """Lista los quizzes disponibles para el usuario."""
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Para admin/moderator ven todos los quizzes activos
        if user.role in ['admin', 'moderator']:
            return Quiz.objects.filter(is_active=True).select_related('course')
        else:
            # Para usuarios regulares, solo quizzes de cursos en los que están inscritos
            from apps.courses.models import Enrollment
            enrolled_courses = Enrollment.objects.filter(user=user).values_list('course_id', flat=True)
            return Quiz.objects.filter(
                course_id__in=enrolled_courses,
                is_active=True
            ).select_related('course')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class QuizDetailView(generics.RetrieveAPIView):
    """Detalle de un quiz específico."""
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Quiz.objects.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CreateQuizView(generics.CreateAPIView):
    """Permite a moderadores y admins crear nuevos quizzes."""
    serializer_class = CreateQuizSerializer
    permission_classes = [IsAdminOrModerator]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class UpdateQuizView(generics.UpdateAPIView):
    """Actualizar quiz existente."""
    serializer_class = CreateQuizSerializer
    permission_classes = [IsAdminOrModerator]
    queryset = Quiz.objects.all()

    def get_queryset(self):
        # Los moderadores solo pueden editar sus propios quizzes
        if self.request.user.role == 'moderator':
            return Quiz.objects.filter(created_by=self.request.user)
        return Quiz.objects.all()


class SubmitQuizView(APIView):
    """Permite al usuario enviar sus respuestas a un quiz."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = SubmitQuizSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        quiz = get_object_or_404(Quiz, id=serializer.validated_data['quiz_id'])
        answers = serializer.validated_data['answers']
        time_taken = serializer.validated_data['time_taken']

        # Crear attempt
        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            time_taken=time_taken
        )
        
        # Evaluar respuestas
        attempt.evaluate(answers)
        
        # Serializar respuesta
        response_serializer = QuizAttemptSerializer(attempt)
        
        return Response({
            "message": "Quiz completado correctamente",
            "attempt": response_serializer.data,
            "xp_gained": quiz.xp_reward if attempt.passed else 0,
            "current_level": request.user.level,
            "total_xp": request.user.xp
        }, status=status.HTTP_201_CREATED)


class UserAttemptsView(generics.ListAPIView):
    """Lista los intentos de quiz del usuario."""
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user).select_related('quiz', 'quiz__course')


class QuizAttemptsView(generics.ListAPIView):
    """Lista los intentos de un quiz específico (solo para admin/moderator)."""
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAdminOrModerator]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return QuizAttempt.objects.filter(quiz_id=quiz_id).select_related('user')


class QuizStatisticsView(APIView):
    """Estadísticas de quizzes (solo admin/moderator)."""
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        from django.db.models import Count, Avg, F
        
        total_quizzes = Quiz.objects.filter(is_active=True).count()
        total_attempts = QuizAttempt.objects.count()
        
        stats = QuizAttempt.objects.aggregate(
            average_score=Avg('score'),
            pass_rate=Avg(F('passed'), output_field=models.FloatField()) * 100
            )
        
        popular_quizzes = Quiz.objects.filter(is_active=True).annotate(
            attempt_count=Count('attempts')
        ).order_by('-attempt_count')[:5].values('id', 'title', 'attempt_count')
        
        data = {
            'total_quizzes': total_quizzes,
            'total_attempts': total_attempts,
            'average_score': stats['average_score'] or 0,
            'pass_rate': stats['pass_rate'] or 0,
            'popular_quizzes': list(popular_quizzes)
        }
        
        serializer = QuizStatisticsSerializer(data)
        return Response(serializer.data)


class CourseQuizzesView(generics.ListAPIView):
    """Lista los quizzes de un curso específico."""
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        user = self.request.user
        
        # Verificar que el usuario esté inscrito en el curso o sea admin/moderator
        if user.role in ['admin', 'moderator']:
            return Quiz.objects.filter(course_id=course_id, is_active=True)
        else:
            from apps.courses.models import Enrollment
            if not Enrollment.objects.filter(user=user, course_id=course_id).exists():
                return Quiz.objects.none()
            return Quiz.objects.filter(course_id=course_id, is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context