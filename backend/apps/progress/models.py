from django.db import models
from django.conf import settings
from apps.courses.models import Course
from apps.quizzes.models import QuizAttempt


class Progress(models.Model):
    """Progreso global de un usuario por curso."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress_records")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="progress_records")
    completed_quizzes = models.PositiveIntegerField(default=0)
    total_quizzes = models.PositiveIntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    xp_earned = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "course")

    def __str__(self):
        return f"{self.user.email} - {self.course.title} ({self.percentage:.0f}%)"

    def update_progress(self):
        """Recalcula el progreso del usuario en este curso."""
        total = self.course.quizzes.count()
        completed = QuizAttempt.objects.filter(user=self.user, quiz__course=self.course, passed=True).count()
        earned_xp = QuizAttempt.objects.filter(user=self.user, quiz__course=self.course, passed=True).aggregate(models.Sum("quiz__xp_reward"))["quiz__xp_reward__sum"] or 0

        self.total_quizzes = total
        self.completed_quizzes = completed
        self.percentage = (completed / total * 100) if total > 0 else 0
        self.xp_earned = earned_xp
        self.save()
