from django.urls import path
from .views import (
    StatsOverviewView,
    XpHistoryView,
    LeaderboardView,
    UserStatisticsView,
    TimeSeriesStatsView,
    AdminStatisticsView,
)

urlpatterns = [
    # Estadísticas del usuario
    path("overview/", StatsOverviewView.as_view(), name="stats-overview"),
    path("user-statistics/", UserStatisticsView.as_view(), name="user-statistics"),
    path("xp-history/", XpHistoryView.as_view(), name="xp-history"),
    path("time-series/", TimeSeriesStatsView.as_view(), name="time-series-stats"),
    
    # Leaderboard
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    
    # Estadísticas de administración
    path("admin/", AdminStatisticsView.as_view(), name="admin-statistics"),
]