from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework import views, permissions
from rest_framework.response import Response
from .models import XpHistory
from .serializers import XpHistorySerializer
from apps.quizzes.models import QuizAttempt
from apps.progress.models import Progress


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

        total_xp_week = (
            XpHistory.objects.filter(user=user, created_at__gte=week_ago)
            .aggregate(total=Sum("xp_gained"))["total"] or 0
        )

        total_quizzes = QuizAttempt.objects.filter(user=user).count()
        passed_quizzes = QuizAttempt.objects.filter(user=user, passed=True).count()
        success_rate = (passed_quizzes / total_quizzes * 100) if total_quizzes else 0

        total_courses = Progress.objects.filter(user=user, percentage__gte=100).count()

        next_level_xp = 0
        xp_thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000]
        for t in xp_thresholds:
            if user.xp < t:
                next_level_xp = t
                break

        progress_to_next_level = int((user.xp / next_level_xp * 100)) if next_level_xp else 100

        return Response({
            "user": user.email,
            "level": user.level,
            "xp": user.xp,
            "next_level_xp": next_level_xp,
            "progress_to_next_level": progress_to_next_level,
            "weekly_xp_gain": total_xp_week,
            "courses_completed": total_courses,
            "quizzes_attempted": total_quizzes,
            "quizzes_passed": passed_quizzes,
            "success_rate": round(success_rate, 1),
        })


class XpHistoryListView(views.APIView):
    """
    Devuelve el historial de XP del usuario, agrupado por día.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        month_ago = now - timedelta(days=30)

        queryset = (
            XpHistory.objects.filter(user=user, created_at__gte=month_ago)
            .extra({"day": "date(created_at)"})
            .values("day")
            .annotate(total_xp=Sum("xp_gained"), events=Count("id"))
            .order_by("day")
        )

        return Response(list(queryset))
