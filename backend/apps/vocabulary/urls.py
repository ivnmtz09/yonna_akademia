from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VocabularyCategoryViewSet, VocabularyEntryViewSet

router = DefaultRouter()
router.register(r"categories", VocabularyCategoryViewSet, basename="vocab-category")
router.register(r"entries", VocabularyEntryViewSet, basename="vocab-entry")

urlpatterns = [
    path("", include(router.urls)),
]
