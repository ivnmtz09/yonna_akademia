from django.urls import path
from .views import AvailableQuizzesView, CreateQuizView, QuizAttemptView

urlpatterns = [
    path("available/", AvailableQuizzesView.as_view(), name="available-quizzes"),
    path("create/", CreateQuizView.as_view(), name="create-quiz"),
    path("attempt/", QuizAttemptView.as_view(), name="attempt-quiz"),
]
