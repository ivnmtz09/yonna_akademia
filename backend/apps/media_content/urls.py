from rest_framework.routers import DefaultRouter
from .views import MediaContentViewSet

router = DefaultRouter()
router.register(r"media", MediaContentViewSet)

urlpatterns = router.urls
