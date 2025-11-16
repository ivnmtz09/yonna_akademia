from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, Avg, Q
from rest_framework import views, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from .models import XpHistory, UserStatistic, PlatformStatistic
from .serializers import (
    XpHistorySerializer,
    UserStatisticSerializer,
    PlatformStatisticSerializer,
    UserStatsOverviewSerializer,
    LeaderboardEntrySerializer,
    TimeSeriesStatSerializer,
)
from apps.users.permissions import IsAdmin, IsModerator, IsAdminOrModerator
from apps.users.models import User
from apps.quizzes.models import QuizAttempt
from apps.progress.models import Progress, GlobalProgress


class StatsOverviewView(views.APIView):
    """
    Devuelve las estadísticas generales del usuario:
    XP, nivel, porcentaje al siguiente nivel, quizzes aprobados, etc.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        # XP por periodos
        weekly_xp = XpHistory.objects.filter(
            user=user, 
            created_at__gte=week_ago
        ).aggregate(total=Sum("xp_gained"))["total"] or 0

        monthly_xp = XpHistory.objects.filter(
            user=user, 
            created_at__gte=month_ago
        ).aggregate(total=Sum("xp_gained"))["total"] or 0

        # Estadísticas de quizzes
        total_quizzes = QuizAttempt.objects.filter(user=user).count()
        passed_quizzes = QuizAttempt.objects.filter(user=user, passed=True).count()
        success_rate = (passed_quizzes / total_quizzes * 100) if total_quizzes else 0

        # Cursos completados
        completed_courses = Progress.objects.filter(
            user=user, 
            course_completed=True
        ).count()

        # Calcular progreso al siguiente nivel
        xp_thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000]
        next_level_xp = 0
        current_level_min_xp = 0
        
        for i, threshold in enumerate(xp_thresholds):
            if user.xp < threshold:
                next_level_xp = threshold
                current_level_min_xp = xp_thresholds[i-1] if i > 0 else 0
                break
        else:
            next_level_xp = xp_thresholds[-1] * 2
            current_level_min_xp = xp_thresholds[-1]

        xp_in_current_level = user.xp - current_level_min_xp
        xp_needed_for_next_level = next_level_xp - current_level_min_xp
        progress_to_next_level = (xp_in_current_level / xp_needed_for_next_level * 100) if xp_needed_for_next_level > 0 else 100

        # Obtener ranking del usuario
        user_rank = User.objects.filter(
            xp__gt=user.xp, 
            is_active=True, 
            role='user'
        ).count() + 1

        # Obtener racha actual
        user_stats, _ = UserStatistic.objects.get_or_create(user=user)
        user_stats.update_statistics()

        data = {
            "user_level": user.level,
            "user_xp": user.xp,
            "next_level_xp": next_level_xp,
            "progress_to_next_level": round(progress_to_next_level, 1),
            "weekly_xp_gain": weekly_xp,
            "monthly_xp_gain": monthly_xp,
            "courses_completed": completed_courses,
            "quizzes_attempted": total_quizzes,
            "quizzes_passed": passed_quizzes,
            "success_rate": round(success_rate, 1),
            "current_streak": user_stats.current_streak_days,
            "rank": user_rank,
        }

        serializer = UserStatsOverviewSerializer(data)
        return Response(serializer.data)


class XpHistoryView(views.APIView):
    """
    Devuelve el historial de XP del usuario.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        timeframe = request.GET.get('timeframe', 'month')  # week, month, year, all
        
        now = timezone.now()
        if timeframe == 'week':
            start_date = now - timedelta(days=7)
        elif timeframe == 'month':
            start_date = now - timedelta(days=30)
        elif timeframe == 'year':
            start_date = now - timedelta(days=365)
        else:
            start_date = None

        queryset = XpHistory.objects.filter(user=user)
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        
        queryset = queryset.select_related('related_quiz', 'related_course')
        queryset = queryset.order_by('-created_at')[:100]  # Limitar a 100 registros

        serializer = XpHistorySerializer(queryset, many=True)
        return Response(serializer.data)


class LeaderboardView(views.APIView):
    """
    Tabla de clasificación de usuarios.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        metric = request.GET.get('metric', 'xp')  # xp, courses, streak, level
        limit = int(request.GET.get('limit', 20))
        
        users = User.objects.filter(is_active=True, role='user')
        
        if metric == 'xp':
            users = users.order_by('-xp', '-level')[:limit]
        elif metric == 'courses':
            users = users.annotate(
                completed_courses=Count('progress_records', filter=Q(progress_records__course_completed=True))
            ).order_by('-completed_courses', '-xp')[:limit]
        elif metric == 'streak':
            users = users.annotate(
                max_streak=Count('statistics__current_streak_days')
            ).order_by('-max_streak', '-xp')[:limit]
        elif metric == 'level':
            users = users.order_by('-level', '-xp')[:limit]

        # Preparar datos para el leaderboard
        leaderboard_data = []
        current_user_rank = None
        
        for rank, user in enumerate(users, 1):
            user_stats, _ = UserStatistic.objects.get_or_create(user=user)
            completed_courses = Progress.objects.filter(user=user, course_completed=True).count()
            
            entry = {
                'rank': rank,
                'user_id': user.id,
                'user_name': user.get_full_name() or user.email.split('@')[0],
                'user_level': user.level,
                'user_xp': user.xp,
                'courses_completed': completed_courses,
                'streak_days': user_stats.current_streak_days,
                'is_current_user': user == request.user
            }
            
            leaderboard_data.append(entry)
            
            if user == request.user:
                current_user_rank = rank

        # Si el usuario actual no está en el top, agregarlo
        if request.user not in users and current_user_rank is None:
            user_rank = User.objects.filter(
                xp__gt=request.user.xp, 
                is_active=True, 
                role='user'
            ).count() + 1
            
            user_stats, _ = UserStatistic.objects.get_or_create(user=request.user)
            completed_courses = Progress.objects.filter(user=request.user, course_completed=True).count()
            
            leaderboard_data.append({
                'rank': user_rank,
                'user_id': request.user.id,
                'user_name': request.user.get_full_name() or request.user.email.split('@')[0],
                'user_level': request.user.level,
                'user_xp': request.user.xp,
                'courses_completed': completed_courses,
                'streak_days': user_stats.current_streak_days,
                'is_current_user': True
            })

        serializer = LeaderboardEntrySerializer(leaderboard_data, many=True)
        return Response(serializer.data)


class UserStatisticsView(views.APIView):
    """
    Estadísticas detalladas del usuario.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_stats, _ = UserStatistic.objects.get_or_create(user=user)
        user_stats.update_statistics()
        
        serializer = UserStatisticSerializer(user_stats)
        return Response(serializer.data)


class TimeSeriesStatsView(views.APIView):
    """
    Estadísticas de series de tiempo para el usuario.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        stat_type = request.GET.get('type', 'xp')  # xp, quizzes, courses
        timeframe = request.GET.get('timeframe', 'month')  # week, month, year
        
        now = timezone.now()
        if timeframe == 'week':
            days = 7
            start_date = now - timedelta(days=days)
        elif timeframe == 'month':
            days = 30
            start_date = now - timedelta(days=days)
        elif timeframe == 'year':
            days = 365
            start_date = now - timedelta(days=days)
        else:
            days = 30
            start_date = now - timedelta(days=days)

        data = []
        
        if stat_type == 'xp':
            # XP ganada por día
            xp_data = XpHistory.objects.filter(
                user=user,
                created_at__gte=start_date
            ).extra({
                'date': "date(created_at)"
            }).values('date').annotate(
                value=Sum('xp_gained')
            ).order_by('date')
            
            for item in xp_data:
                data.append({
                    'date': item['date'],
                    'value': item['value'],
                    'label': f"+{item['value']} XP"
                })
                
        elif stat_type == 'quizzes':
            # Quizzes tomados por día
            quiz_data = QuizAttempt.objects.filter(
                user=user,
                completed_at__gte=start_date
            ).extra({
                'date': "date(completed_at)"
            }).values('date').annotate(
                value=Count('id')
            ).order_by('date')
            
            for item in quiz_data:
                data.append({
                    'date': item['date'],
                    'value': item['value'],
                    'label': f"{item['value']} quizzes"
                })
                
        elif stat_type == 'courses':
            # Cursos completados (acumulado)
            course_data = Progress.objects.filter(
                user=user,
                course_completed=True,
                completed_at__gte=start_date
            ).extra({
                'date': "date(completed_at)"
            }).values('date').annotate(
                value=Count('id')
            ).order_by('date')
            
            cumulative = 0
            for item in course_data:
                cumulative += item['value']
                data.append({
                    'date': item['date'],
                    'value': cumulative,
                    'label': f"{cumulative} cursos"
                })

        serializer = TimeSeriesStatSerializer(data, many=True)
        return Response(serializer.data)


class AdminStatisticsView(views.APIView):
    """
    Estadísticas de administración para la plataforma.
    """
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        timeframe = request.GET.get('timeframe', 'today')  # today, week, month
        
        now = timezone.now()
        if timeframe == 'week':
            start_date = now - timedelta(days=7)
        elif timeframe == 'month':
            start_date = now - timedelta(days=30)
        else:
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # Actualizar estadísticas de hoy
        PlatformStatistic.update_daily_statistics()
        
        # Obtener estadísticas de hoy
        today_stats = PlatformStatistic.objects.filter(date=now.date()).first()
        
        # Métricas adicionales
        total_users = User.objects.filter(is_active=True, role='user').count()
        total_courses_completed = Progress.objects.filter(course_completed=True).count()
        total_xp_platform = XpHistory.objects.aggregate(total=Sum('xp_gained'))['total'] or 0
        
        # Usuarios activos en el período
        active_users = User.objects.filter(
            models.Q(quiz_attempts__completed_at__gte=start_date) |
            models.Q(xp_history__created_at__gte=start_date),
            is_active=True,
            role='user'
        ).distinct().count()

        data = {
            'timeframe': timeframe,
            'period_start': start_date,
            'total_users': total_users,
            'active_users': active_users,
            'total_courses_completed': total_courses_completed,
            'total_xp_platform': total_xp_platform,
            'daily_stats': PlatformStatisticSerializer(today_stats).data if today_stats else None,
            'top_users': self._get_top_users(10),
            'popular_courses': self._get_popular_courses(5),
        }
        
        return Response(data)
    
    def _get_top_users(self, limit):
        """Obtiene los usuarios top por XP."""
        users = User.objects.filter(
            is_active=True, 
            role='user'
        ).order_by('-xp', '-level')[:limit]
        
        return [
            {
                'id': user.id,
                'name': user.get_full_name() or user.email,
                'level': user.level,
                'xp': user.xp,
                'courses_completed': Progress.objects.filter(user=user, course_completed=True).count()
            }
            for user in users
        ]
    
    def _get_popular_courses(self, limit):
        """Obtiene los cursos más populares."""
        from apps.courses.models import Course
        
        courses = Course.objects.filter(is_active=True).annotate(
            enrollment_count=Count('enrollments'),
            completion_count=Count('enrollments', filter=Q(enrollments__course_completed=True)),
            avg_progress=Avg('progress_records__percentage')
        ).order_by('-enrollment_count')[:limit]
        
        return [
            {
                'id': course.id,
                'title': course.title,
                'enrollment_count': course.enrollment_count,
                'completion_count': course.completion_count,
                'completion_rate': (course.completion_count / course.enrollment_count * 100) if course.enrollment_count > 0 else 0,
                'average_progress': course.avg_progress or 0
            }
            for course in courses
        ]