from django.db import models
from django.conf import settings
from apps.courses.models import Course, Enrollment
from apps.quizzes.models import QuizAttempt


class Progress(models.Model):
    """Progreso global de un usuario por curso."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress_records")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="progress_records")
    completed_quizzes = models.PositiveIntegerField(default=0)
    total_quizzes = models.PositiveIntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    xp_earned = models.PositiveIntegerField(default=0)
    course_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    streak_days = models.PositiveIntegerField(default=0, help_text="Días consecutivos estudiando este curso")
    last_study_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "course")
        verbose_name_plural = "Progress"
        indexes = [
            models.Index(fields=['user', 'course_completed']),
            models.Index(fields=['course', 'percentage']),
            models.Index(fields=['updated_at']),
        ]

    def __str__(self):
        status = "Completado" if self.course_completed else f"{self.percentage:.0f}%"
        return f"{self.user.email} - {self.course.title} ({status})"

    def update_progress(self):
        """Recalcula el progreso del usuario en este curso."""
        from django.utils import timezone
        from datetime import date
        
        # Obtener quizzes activos del curso
        total_quizzes = self.course.quizzes.filter(is_active=True).count()
        
        # Obtener quizzes completados (aprobados)
        completed_attempts = QuizAttempt.objects.filter(
            user=self.user, 
            quiz__course=self.course, 
            quiz__is_active=True,
            passed=True
        ).values('quiz').distinct()
        
        completed_quizzes = completed_attempts.count()
        
        # Calcular XP ganada en este curso
        earned_xp = QuizAttempt.objects.filter(
            user=self.user, 
            quiz__course=self.course, 
            quiz__is_active=True,
            passed=True
        ).aggregate(models.Sum("quiz__xp_reward"))["quiz__xp_reward__sum"] or 0

        # Actualizar campos
        self.total_quizzes = total_quizzes
        self.completed_quizzes = completed_quizzes
        self.percentage = (completed_quizzes / total_quizzes * 100) if total_quizzes > 0 else 0
        self.xp_earned = earned_xp
        
        # Verificar si el curso está completado
        old_completed_status = self.course_completed
        self.course_completed = self.percentage >= 100.0
        
        # Si se completó el curso ahora, registrar la fecha
        if self.course_completed and not old_completed_status:
            self.completed_at = timezone.now()
            
            # Actualizar también el enrollment
            enrollment = Enrollment.objects.filter(user=self.user, course=self.course).first()
            if enrollment:
                enrollment.course_completed = True
                enrollment.completed_at = timezone.now()
                enrollment.save()
        
        # Actualizar racha de estudio
        self._update_streak()
        
        self.save()

    def _update_streak(self):
        """Actualiza la racha de estudio del usuario."""
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        
        if not self.last_study_date:
            # Primera vez que estudia
            self.streak_days = 1
            self.last_study_date = today
        else:
            days_diff = (today - self.last_study_date).days
            
            if days_diff == 0:
                # Ya estudió hoy, mantener la racha
                pass
            elif days_diff == 1:
                # Día consecutivo, incrementar racha
                self.streak_days += 1
                self.last_study_date = today
            else:
                # Rompió la racha, reiniciar
                self.streak_days = 1
                self.last_study_date = today

    @property
    def remaining_quizzes(self):
        return self.total_quizzes - self.completed_quizzes

    @property
    def estimated_completion_time(self):
        """Tiempo estimado para completar el curso (en días) basado en el ritmo actual"""
        if self.completed_quizzes == 0 or self.streak_days == 0:
            return None
            
        avg_quizzes_per_day = self.completed_quizzes / self.streak_days
        if avg_quizzes_per_day > 0:
            return self.remaining_quizzes / avg_quizzes_per_day
        return None

    @classmethod
    def update_user_progress_for_course(cls, user, course):
        """Método de clase para actualizar progreso de un usuario en un curso."""
        progress, created = cls.objects.get_or_create(user=user, course=course)
        progress.update_progress()
        return progress

    @classmethod
    def update_all_user_progress(cls, user):
        """Actualiza el progreso de un usuario en todos sus cursos inscritos."""
        enrolled_courses = Course.objects.filter(enrollments__user=user)
        for course in enrolled_courses:
            cls.update_user_progress_for_course(user, course)


class GlobalProgress(models.Model):
    """Progreso global del usuario en toda la plataforma."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="global_progress"
    )
    total_courses_enrolled = models.PositiveIntegerField(default=0)
    total_courses_completed = models.PositiveIntegerField(default=0)
    total_quizzes_completed = models.PositiveIntegerField(default=0)
    total_xp_earned = models.PositiveIntegerField(default=0)
    average_progress = models.FloatField(default=0.0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Global Progress"

    def __str__(self):
        return f"Progreso global de {self.user.email}"

    def update_global_progress(self):
        """Actualiza las estadísticas globales del usuario."""
        from django.db.models import Avg, Count, Sum
        
        # Obtener todos los progresos del usuario
        progresses = Progress.objects.filter(user=self.user)
        
        # Calcular estadísticas
        self.total_courses_enrolled = progresses.count()
        self.total_courses_completed = progresses.filter(course_completed=True).count()
        self.total_quizzes_completed = progresses.aggregate(
            total=Sum('completed_quizzes')
        )['total'] or 0
        self.total_xp_earned = progresses.aggregate(
            total=Sum('xp_earned')
        )['total'] or 0
        self.average_progress = progresses.aggregate(
            avg=Avg('percentage')
        )['avg'] or 0.0
        
        # Calcular racha actual (máxima racha entre todos los cursos)
        self.current_streak = progresses.aggregate(
            max_streak=Max('streak_days')
        )['max_streak'] or 0
        
        # Actualizar racha más larga si es necesario
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        
        self.save()

    @classmethod
    def update_for_user(cls, user):
        """Actualiza el progreso global de un usuario."""
        global_progress, created = cls.objects.get_or_create(user=user)
        global_progress.update_global_progress()
        return global_progress