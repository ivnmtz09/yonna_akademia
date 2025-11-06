from django.urls import path
from .views import StatsOverviewView, XpHistoryListView

urlpatterns = [
    path("overview/", StatsOverviewView.as_view(), name="stats-overview"),
    path("xp-history/", XpHistoryListView.as_view(), name="xp-history"),
]
