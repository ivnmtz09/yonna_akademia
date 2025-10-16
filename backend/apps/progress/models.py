from django.db import models
from django.conf import settings
from apps.courses.models import Course, Lesson
from apps.quizzes.models import Quiz

User = settings.AUTH_USER_MODEL

class CourseProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="course_progress")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="progress")
    completed = models.BooleanField(default=False)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "course")

    def __str__(self):
        return f"{self.user} - {self.course.title} ({self.progress_percent}%)"


class LessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress")
    completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user} - {self.lesson.title} ({'Done' if self.completed else 'Pending'})"


class QuizProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quiz_progress")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="progress")
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "quiz")

    def __str__(self):
        return f"{self.user} - {self.quiz.title} ({self.score} pts)"
