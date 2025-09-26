from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, QuestionViewSet, AnswerViewSet, QuizResultViewSet

router = DefaultRouter()
router.register(r"quizzes", QuizViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"answers", AnswerViewSet)
router.register(r"results", QuizResultViewSet)

urlpatterns = router.urls
