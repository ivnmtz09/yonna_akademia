from django.urls import path
from .views import (
    AvailableQuizzesView,
    QuizDetailView,
    CreateQuizView,
    UpdateQuizView,
    SubmitQuizView,
    UserAttemptsView,
    QuizAttemptsView,
    QuizStatisticsView,
    CourseQuizzesView,
)

urlpatterns = [
    # Quizzes disponibles
    path("available/", AvailableQuizzesView.as_view(), name="available-quizzes"),
    path("<int:pk>/", QuizDetailView.as_view(), name="quiz-detail"),
    path("course/<int:course_id>/", CourseQuizzesView.as_view(), name="course-quizzes"),
    
    # Gestión de quizzes (admin/moderator)
    path("create/", CreateQuizView.as_view(), name="create-quiz"),
    path("<int:pk>/update/", UpdateQuizView.as_view(), name="update-quiz"),
    
    # Intentos de quiz
    path("submit/", SubmitQuizView.as_view(), name="submit-quiz"),
    path("my-attempts/", UserAttemptsView.as_view(), name="user-attempts"),
    path("<int:quiz_id>/attempts/", QuizAttemptsView.as_view(), name="quiz-attempts"),
    
    # Estadísticas
    path("statistics/", QuizStatisticsView.as_view(), name="quiz-statistics"),
]