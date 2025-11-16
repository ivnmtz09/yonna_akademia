from django.db import models
from django.conf import settings


class Course(models.Model):
    """Representa un curso desbloqueable según el nivel del estudiante."""

    LEVEL_CHOICES = [(i, f"Nivel {i}") for i in range(1, 11)]

    title = models.CharField(max_length=200)
    description = models.TextField()
    level_required = models.PositiveIntegerField(choices=LEVEL_CHOICES, default=1)
    is_active = models.BooleanField(default=True)
    
    # Campos adicionales para mejor UX
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    estimated_duration = models.PositiveIntegerField(help_text="Duración estimada en horas", default=4)
    difficulty = models.CharField(
        max_length=20,
        choices=[('beginner', 'Principiante'), ('intermediate', 'Intermedio'), ('advanced', 'Avanzado')],
        default='beginner'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["level_required", "title"]
        indexes = [
            models.Index(fields=['level_required', 'is_active']),
            models.Index(fields=['is_active', 'created_at']),
        ]

    def __str__(self):
        return f"{self.title} (Nivel {self.level_required})"

    @property
    def enrolled_students_count(self):
        return self.enrollments.filter(course_completed=False).count()

    @property
    def completed_students_count(self):
        return self.enrollments.filter(course_completed=True).count()


class Enrollment(models.Model):
    """Registra la inscripción de un estudiante en un curso."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    progress = models.FloatField(default=0.0)
    course_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "course")
        indexes = [
            models.Index(fields=['user', 'course_completed']),
            models.Index(fields=['course', 'course_completed']),
        ]

    def __str__(self):
        status = "Completado" if self.course_completed else f"{self.progress}%"
        return f"{self.user.email} en {self.course.title} ({status})"

    def update_progress(self, new_progress):
        """Actualiza el progreso y marca como completado si llega al 100%"""
        self.progress = min(100.0, max(0.0, new_progress))
        
        if self.progress >= 100.0 and not self.course_completed:
            self.course_completed = True
            from django.utils import timezone
            self.completed_at = timezone.now()
        
        self.save()

    def calculate_progress_based_on_quizzes(self):
        """Calcula el progreso basado en quizzes completados"""
        from apps.quizzes.models import Quiz, QuizAttempt
        course_quizzes = Quiz.objects.filter(course=self.course, is_active=True)
        total_quizzes = course_quizzes.count()
        
        if total_quizzes == 0:
            return 0.0
            
        completed_quizzes = QuizAttempt.objects.filter(
            user=self.user,
            quiz__in=course_quizzes,
            passed=True
        ).values('quiz').distinct().count()
        
        progress = (completed_quizzes / total_quizzes) * 100.0
        self.update_progress(progress)
        return progress