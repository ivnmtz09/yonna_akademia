from django.urls import path
from .views import (
    UserProgressView,
    CourseProgressView,
    GlobalProgressView,
    UpdateProgressView,
    LeaderboardView,
    UserStatisticsView,
    AdminProgressStatisticsView,
)

urlpatterns = [
    # Progreso del usuario
    path("", UserProgressView.as_view(), name="user-progress"),
    path("global/", GlobalProgressView.as_view(), name="global-progress"),
    path("course/<int:course_id>/", CourseProgressView.as_view(), name="course-progress"),
    path("update/", UpdateProgressView.as_view(), name="update-progress"),
    path("statistics/", UserStatisticsView.as_view(), name="user-statistics"),
    
    # Leaderboard
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    
    # Estadísticas de administración
    path("admin-statistics/", AdminProgressStatisticsView.as_view(), name="admin-progress-statistics"),
]