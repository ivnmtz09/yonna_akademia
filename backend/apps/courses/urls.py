from django.urls import path
from .views import (
    AvailableCoursesView,
    CourseDetailView,
    CreateCourseView,
    UpdateCourseView,
    EnrollCourseView,
    UserEnrollmentsView,
    CourseEnrollmentsView,
    UpdateProgressView,
    CourseStatisticsView,
)

urlpatterns = [
    # Cursos disponibles
    path("available/", AvailableCoursesView.as_view(), name="available-courses"),
    path("<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    
    # Gestión de cursos (admin/moderator)
    path("create/", CreateCourseView.as_view(), name="create-course"),
    path("<int:pk>/update/", UpdateCourseView.as_view(), name="update-course"),
    
    # Inscripciones
    path("enroll/", EnrollCourseView.as_view(), name="enroll-course"),
    path("my-enrollments/", UserEnrollmentsView.as_view(), name="user-enrollments"),
    path("<int:course_id>/enrollments/", CourseEnrollmentsView.as_view(), name="course-enrollments"),
    
    # Progreso
    path("update-progress/", UpdateProgressView.as_view(), name="update-progress"),
    
    # Estadísticas
    path("statistics/", CourseStatisticsView.as_view(), name="course-statistics"),
]