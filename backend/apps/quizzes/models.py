from django.db import models
from django.conf import settings
from apps.courses.models import Course


class Quiz(models.Model):
    """Quiz asociado a un curso específico."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="quizzes")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    passing_score = models.FloatField(default=70.0)
    xp_reward = models.PositiveIntegerField(default=50)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quizzes_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["course", "title"]

    def __str__(self):
        return f"{self.title} ({self.course.title})"


class Question(models.Model):
    """Preguntas asociadas a un quiz."""
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    options = models.JSONField(default=list)  # Ejemplo: ["Opción 1", "Opción 2", "Opción 3"]
    correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.quiz.title} - {self.text[:50]}"


class QuizAttempt(models.Model):
    """Intento de un estudiante al responder un quiz."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_attempts")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    score = models.FloatField(default=0.0)
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    def evaluate(self):
        """Otorga XP automáticamente si aprueba el quiz."""
        self.passed = self.score >= self.quiz.passing_score
        self.save()
        if self.passed:
            self.user.add_xp(self.quiz.xp_reward)
