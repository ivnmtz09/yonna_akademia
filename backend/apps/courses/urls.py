from django.urls import path
from .views import AvailableCoursesView, CreateCourseView, EnrollCourseView

urlpatterns = [
    path("available/", AvailableCoursesView.as_view(), name="available-courses"),
    path("create/", CreateCourseView.as_view(), name="create-course"),
    path("enroll/", EnrollCourseView.as_view(), name="enroll-course"),
]
