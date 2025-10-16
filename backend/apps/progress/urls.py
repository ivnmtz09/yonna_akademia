from rest_framework.routers import DefaultRouter
from .views import CourseProgressViewSet, LessonProgressViewSet, QuizProgressViewSet

router = DefaultRouter()
router.register(r"course-progress", CourseProgressViewSet)
router.register(r"lesson-progress", LessonProgressViewSet)
router.register(r"quiz-progress", QuizProgressViewSet)

urlpatterns = router.urls
