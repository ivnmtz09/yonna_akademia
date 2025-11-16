from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaContentViewSet, MediaCollectionViewSet, MediaStatisticsViewSet

router = DefaultRouter()
router.register(r"media", MediaContentViewSet, basename="media")
router.register(r"collections", MediaCollectionViewSet, basename="collections")
router.register(r"statistics", MediaStatisticsViewSet, basename="media-statistics")

urlpatterns = [
    path("", include(router.urls)),
]