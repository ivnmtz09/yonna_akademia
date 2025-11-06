from django.urls import path
from .views import UserProgressView, CourseProgressView

urlpatterns = [
    path("", UserProgressView.as_view(), name="user-progress"),
    path("<int:course_id>/", CourseProgressView.as_view(), name="course-progress"),
]
