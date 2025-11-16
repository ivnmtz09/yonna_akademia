from django.db import models
from django.conf import settings


class XpHistory(models.Model):
    """Historial de ganancia de XP del usuario."""
    
    SOURCE_CHOICES = [
        ('quiz', 'Quiz'),
        ('course_completion', 'Completación de Curso'),
        ('daily_streak', 'Racha Diaria'),
        ('achievement', 'Logro'),
        ('system_bonus', 'Bonus del Sistema'),
        ('level_up', 'Subida de Nivel'),
        ('correction', 'Corrección'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="xp_history"
    )
    xp_gained = models.PositiveIntegerField()
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='quiz')
    description = models.CharField(max_length=255, blank=True, null=True)
    
    # Campos para relacionar con otras entidades
    related_quiz = models.ForeignKey(
        'quizzes.Quiz',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="xp_events"
    )
    related_course = models.ForeignKey(
        'courses.Course',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="xp_events"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "XP History"
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['source', 'created_at']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} +{self.xp_gained} XP ({self.source})"


class UserStatistic(models.Model):
    """Estadísticas acumuladas del usuario."""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="statistics"
    )
    
    # Estadísticas de quizzes
    total_quizzes_attempted = models.PositiveIntegerField(default=0)
    total_quizzes_passed = models.PositiveIntegerField(default=0)
    average_quiz_score = models.FloatField(default=0.0)
    
    # Estadísticas de cursos
    total_courses_started = models.PositiveIntegerField(default=0)
    total_courses_completed = models.PositiveIntegerField(default=0)
    
    # Tiempo y actividad
    total_study_time_minutes = models.PositiveIntegerField(default=0)
    current_streak_days = models.PositiveIntegerField(default=0)
    longest_streak_days = models.PositiveIntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    
    # Logros y métricas
    total_xp_earned = models.PositiveIntegerField(default=0)
    days_active = models.PositiveIntegerField(default=0)
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'updated_at']),
        ]

    def __str__(self):
        return f"Estadísticas de {self.user.email}"

    @property
    def quiz_success_rate(self):
        if self.total_quizzes_attempted == 0:
            return 0.0
        return (self.total_quizzes_passed / self.total_quizzes_attempted) * 100

    @property
    def course_completion_rate(self):
        if self.total_courses_started == 0:
            return 0.0
        return (self.total_courses_completed / self.total_courses_started) * 100

    def update_statistics(self):
        """Actualiza todas las estadísticas del usuario."""
        from apps.quizzes.models import QuizAttempt
        from apps.courses.models import Enrollment, Progress
        from django.utils import timezone
        from datetime import date
        
        # Estadísticas de quizzes
        quiz_stats = QuizAttempt.objects.filter(user=self.user).aggregate(
            total_attempts=models.Count('id'),
            passed_attempts=models.Count('id', filter=models.Q(passed=True)),
            avg_score=models.Avg('score')
        )
        
        self.total_quizzes_attempted = quiz_stats['total_attempts'] or 0
        self.total_quizzes_passed = quiz_stats['passed_attempts'] or 0
        self.average_quiz_score = quiz_stats['avg_score'] or 0.0
        
        # Estadísticas de cursos
        course_stats = Enrollment.objects.filter(user=self.user).aggregate(
            total_courses=models.Count('id'),
            completed_courses=models.Count('id', filter=models.Q(course_completed=True))
        )
        
        self.total_courses_started = course_stats['total_courses'] or 0
        self.total_courses_completed = course_stats['completed_courses'] or 0
        
        # XP total
        xp_total = XpHistory.objects.filter(user=self.user).aggregate(
            total=models.Sum('xp_gained')
        )['total'] or 0
        self.total_xp_earned = xp_total
        
        # Actualizar racha y actividad
        self._update_streak_and_activity()
        
        self.save()

    def _update_streak_and_activity(self):
        """Actualiza la racha y días activos del usuario."""
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        
        # Obtener la última fecha de actividad (de quizzes o XP ganado)
        last_quiz = self.user.quiz_attempts.order_by('-completed_at').first()
        last_xp = self.user.xp_history.order_by('-created_at').first()
        
        last_activity = None
        if last_quiz and last_xp:
            last_activity = max(last_quiz.completed_at.date(), last_xp.created_at.date())
        elif last_quiz:
            last_activity = last_quiz.completed_at.date()
        elif last_xp:
            last_activity = last_xp.created_at.date()
        
        if last_activity:
            self.last_active_date = last_activity
            
            # Calcular racha actual
            if last_activity == today:
                # El usuario estuvo activo hoy
                if self.last_active_date and (today - self.last_active_date).days == 1:
                    self.current_streak_days += 1
                else:
                    self.current_streak_days = 1
                
                # Actualizar racha más larga
                if self.current_streak_days > self.longest_streak_days:
                    self.longest_streak_days = self.current_streak_days
            else:
                # Rompió la racha
                self.current_streak_days = 0
        
        # Calcular días activos totales (días distintos con actividad)
        distinct_days = XpHistory.objects.filter(
            user=self.user
        ).dates('created_at', 'day').distinct().count()
        
        self.days_active = distinct_days


class PlatformStatistic(models.Model):
    """Estadísticas globales de la plataforma."""
    
    date = models.DateField(unique=True)
    
    # Métricas de usuarios
    total_users = models.PositiveIntegerField(default=0)
    new_users_today = models.PositiveIntegerField(default=0)
    active_users_today = models.PositiveIntegerField(default=0)
    
    # Métricas de actividad
    total_quizzes_taken = models.PositiveIntegerField(default=0)
    total_xp_gained = models.PositiveIntegerField(default=0)
    total_courses_started = models.PositiveIntegerField(default=0)
    total_courses_completed = models.PositiveIntegerField(default=0)
    
    # Métricas de engagement
    average_session_time = models.PositiveIntegerField(default=0)  # en minutos
    average_user_level = models.FloatField(default=1.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        indexes = [
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"Estadísticas de plataforma - {self.date}"

    @classmethod
    def update_daily_statistics(cls):
        """Actualiza las estadísticas diarias de la plataforma."""
        from django.utils import timezone
        from django.db.models import Count, Avg, Sum
        from apps.users.models import User
        from apps.quizzes.models import QuizAttempt
        from apps.courses.models import Enrollment
        
        today = timezone.now().date()
        
        # Obtener o crear estadísticas para hoy
        stats, created = cls.objects.get_or_create(date=today)
        
        # Usuarios
        stats.total_users = User.objects.filter(is_active=True, role='user').count()
        stats.new_users_today = User.objects.filter(
            date_joined__date=today,
            is_active=True,
            role='user'
        ).count()
        
        # Usuarios activos hoy (con actividad de quiz o XP)
        active_users = User.objects.filter(
            models.Q(quiz_attempts__completed_at__date=today) |
            models.Q(xp_history__created_at__date=today),
            is_active=True,
            role='user'
        ).distinct().count()
        stats.active_users_today = active_users
        
        # Actividad de hoy
        stats.total_quizzes_taken = QuizAttempt.objects.filter(
            completed_at__date=today
        ).count()
        
        stats.total_xp_gained = XpHistory.objects.filter(
            created_at__date=today
        ).aggregate(total=Sum('xp_gained'))['total'] or 0
        
        stats.total_courses_started = Enrollment.objects.filter(
            enrolled_at__date=today
        ).count()
        
        stats.total_courses_completed = Enrollment.objects.filter(
            completed_at__date=today
        ).count()
        
        # Métricas promedio
        user_levels = User.objects.filter(
            is_active=True, 
            role='user'
        ).aggregate(avg_level=Avg('level'))
        stats.average_user_level = user_levels['avg_level'] or 1.0
        
        stats.save()
        return stats