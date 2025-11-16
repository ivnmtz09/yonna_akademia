from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count, Sum, F
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta

from .models import Progress, GlobalProgress
from .serializers import (
    ProgressSerializer,
    GlobalProgressSerializer,
    ProgressUpdateSerializer,
    LeaderboardSerializer,
)
from apps.users.permissions import IsAdmin, IsModerator, IsAdminOrModerator
from apps.users.models import User


class UserProgressView(generics.ListAPIView):
    """Devuelve el progreso de todos los cursos en los que el usuario está inscrito."""
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Actualizar progreso para todos los cursos
        Progress.update_all_user_progress(user)
        return Progress.objects.filter(user=user).select_related('course')


class CourseProgressView(generics.RetrieveAPIView):
    """Muestra el progreso del usuario en un curso específico."""
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        course_id = self.kwargs.get("course_id")
        progress = Progress.update_user_progress_for_course(user, course_id)
        return progress


class GlobalProgressView(generics.RetrieveAPIView):
    """Muestra el progreso global del usuario."""
    serializer_class = GlobalProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        # Actualizar progreso global
        global_progress = GlobalProgress.update_for_user(user)
        return global_progress


class UpdateProgressView(APIView):
    """Fuerza la actualización del progreso."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        course_id = serializer.validated_data.get('course_id')
        
        if course_id:
            # Actualizar progreso de un curso específico
            progress = Progress.update_user_progress_for_course(user, course_id)
            progress_serializer = ProgressSerializer(progress)
            return Response({
                "message": "Progreso del curso actualizado",
                "progress": progress_serializer.data
            })
        else:
            # Actualizar todo el progreso
            Progress.update_all_user_progress(user)
            GlobalProgress.update_for_user(user)
            return Response({
                "message": "Progreso global actualizado correctamente"
            })


class LeaderboardView(APIView):
    """Tabla de clasificación de usuarios."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        timeframe = request.GET.get('timeframe', 'all')  # all, weekly, monthly
        metric = request.GET.get('metric', 'xp')  # xp, courses, quizzes, streak
        
        # Definir rango de tiempo
        if timeframe == 'weekly':
            start_date = datetime.now() - timedelta(days=7)
        elif timeframe == 'monthly':
            start_date = datetime.now() - timedelta(days=30)
        else:
            start_date = None
        
        # Construir queryset base
        users = User.objects.filter(is_active=True, role='user')
        
        # Aplicar filtro de tiempo si es necesario
        if start_date:
            users = users.filter(
                quiz_attempts__completed_at__gte=start_date
            ).distinct()
        
        # Ordenar según la métrica
        if metric == 'xp':
            users = users.order_by('-xp', '-level')
        elif metric == 'courses':
            users = users.annotate(
                completed_courses=Count('progress_records', filter=Q(progress_records__course_completed=True))
            ).order_by('-completed_courses', '-xp')
        elif metric == 'quizzes':
            users = users.annotate(
                completed_quizzes=Count('quiz_attempts', filter=Q(quiz_attempts__passed=True))
            ).order_by('-completed_quizzes', '-xp')
        elif metric == 'streak':
            users = users.annotate(
                max_streak=Max('progress_records__streak_days')
            ).order_by('-max_streak', '-xp')
        
        # Limitar a top 50
        users = users[:50]
        
        # Preparar datos para el serializer
        leaderboard_data = []
        for rank, user in enumerate(users, 1):
            global_progress = GlobalProgress.update_for_user(user)
            
            leaderboard_data.append({
                'user_id': user.id,
                'user_name': user.get_full_name() or user.email,
                'user_level': user.level,
                'user_xp': user.xp,
                'total_courses_completed': global_progress.total_courses_completed,
                'total_quizzes_completed': global_progress.total_quizzes_completed,
                'current_streak': global_progress.current_streak,
                'rank': rank
            })
        
        serializer = LeaderboardSerializer(leaderboard_data, many=True)
        return Response(serializer.data)


class UserStatisticsView(APIView):
    """Estadísticas detalladas del usuario."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        global_progress = GlobalProgress.update_for_user(user)
        
        # Estadísticas adicionales
        from apps.quizzes.models import QuizAttempt
        from django.db.models import Count, Avg
        
        quiz_stats = QuizAttempt.objects.filter(user=user).aggregate(
            total_attempts=Count('id'),
            average_score=Avg('score'),
            pass_rate=Avg(F('passed'), output_field=models.FloatField()) * 100
        )
        
        # Progreso por dificultad de cursos
        difficulty_progress = Progress.objects.filter(user=user).values(
            'course__difficulty'
        ).annotate(
            avg_progress=Avg('percentage'),
            count=Count('id')
        )
        
        data = {
            'global_progress': GlobalProgressSerializer(global_progress).data,
            'quiz_statistics': {
                'total_attempts': quiz_stats['total_attempts'] or 0,
                'average_score': round(quiz_stats['average_score'] or 0, 2),
                'pass_rate': round(quiz_stats['pass_rate'] or 0, 2),
            },
            'difficulty_progress': list(difficulty_progress),
            'current_rank': self._get_user_rank(user),
        }
        
        return Response(data)
    
    def _get_user_rank(self, user):
        """Obtiene el ranking del usuario basado en XP."""
        user_count = User.objects.filter(
            xp__gt=user.xp, 
            is_active=True, 
            role='user'
        ).count()
        return user_count + 1


class AdminProgressStatisticsView(APIView):
    """Estadísticas de progreso para administradores y moderadores."""
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        from django.db.models import Count, Avg, Sum
        from apps.courses.models import Course
        
        # Estadísticas generales
        total_users = User.objects.filter(role='user', is_active=True).count()
        total_courses = Course.objects.filter(is_active=True).count()
        total_quizzes_completed = QuizAttempt.objects.filter(passed=True).count()
        
        # Progreso promedio de usuarios
        avg_global_progress = GlobalProgress.objects.aggregate(
            avg_progress=Avg('average_progress')
        )['avg_progress'] or 0
        
        # Cursos más populares (con más inscripciones)
        popular_courses = Course.objects.filter(is_active=True).annotate(
            enrollment_count=Count('enrollments'),
            avg_progress=Avg('progress_records__percentage')
        ).order_by('-enrollment_count')[:10]
        
        # Usuarios más activos
        active_users = User.objects.filter(
            role='user', 
            is_active=True
        ).annotate(
            quiz_attempts_count=Count('quiz_attempts')
        ).order_by('-quiz_attempts_count')[:10]
        
        data = {
            'total_users': total_users,
            'total_courses': total_courses,
            'total_quizzes_completed': total_quizzes_completed,
            'average_platform_progress': round(avg_global_progress, 2),
            'popular_courses': [
                {
                    'id': course.id,
                    'title': course.title,
                    'enrollment_count': course.enrollment_count,
                    'average_progress': round(course.avg_progress or 0, 2)
                }
                for course in popular_courses
            ],
            'active_users': [
                {
                    'id': user.id,
                    'email': user.email,
                    'level': user.level,
                    'xp': user.xp,
                    'quiz_attempts': user.quiz_attempts_count
                }
                for user in active_users
            ]
        }
        
        return Response(data)