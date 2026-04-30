from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db.models import Sum
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Badge, UserBadge, Streak, XPTransaction

User = get_user_model()

LEADERBOARD_CACHE_KEY = "gamification:leaderboard:global"
LEADERBOARD_CACHE_TTL = 300  # 5 minutos


# ──────────────────────────────────────────────────────────────────────────────
# Serializers
# ──────────────────────────────────────────────────────────────────────────────

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ["id", "name", "slug", "description", "icon", "trigger", "threshold", "xp_reward"]


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ["id", "badge", "earned_at"]


class StreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Streak
        fields = [
            "current_streak", "longest_streak",
            "last_activity_date", "freeze_tokens",
        ]


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_xp = serializers.IntegerField()


# ──────────────────────────────────────────────────────────────────────────────
# ViewSets
# ──────────────────────────────────────────────────────────────────────────────

@extend_schema(tags=["Gamificación"])
class GamificationViewSet(viewsets.GenericViewSet):
    """
    Endpoints de gamificación: racha, insignias y leaderboard.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Mi racha actual",
        responses=StreakSerializer,
    )
    @action(detail=False, methods=["get"], url_path="my-streak")
    def my_streak(self, request):
        streak, _ = Streak.objects.get_or_create(user=request.user)
        return Response(StreakSerializer(streak).data)

    @extend_schema(
        summary="Mis insignias",
        responses=UserBadgeSerializer(many=True),
    )
    @action(detail=False, methods=["get"], url_path="my-badges")
    def my_badges(self, request):
        qs = (
            UserBadge.objects
            .filter(user=request.user)
            .select_related("badge")
            .order_by("-earned_at")
        )
        return Response(UserBadgeSerializer(qs, many=True).data)

    @extend_schema(
        summary="Leaderboard global (top 50)",
        responses=LeaderboardEntrySerializer(many=True),
        parameters=[
            OpenApiParameter(
                name="limit",
                description="Número de posiciones a devolver (máx. 100)",
                required=False,
                type=int,
            )
        ],
    )
    @action(detail=False, methods=["get"], url_path="leaderboard")
    def leaderboard(self, request):
        limit = min(int(request.query_params.get("limit", 50)), 100)
        cache_key = f"{LEADERBOARD_CACHE_KEY}:top{limit}"

        data = cache.get(cache_key)
        if data is None:
            qs = (
                XPTransaction.objects
                .values("user_id", "user__username")
                .annotate(total_xp=Sum("amount"))
                .order_by("-total_xp")[:limit]
            )
            data = [
                {
                    "rank": idx + 1,
                    "user_id": entry["user_id"],
                    "username": entry["user__username"],
                    "total_xp": entry["total_xp"] or 0,
                }
                for idx, entry in enumerate(qs)
            ]
            cache.set(cache_key, data, LEADERBOARD_CACHE_TTL)

        return Response(LeaderboardEntrySerializer(data, many=True).data)
