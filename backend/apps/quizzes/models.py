from django.db import models
from django.conf import settings
from apps.courses.models import Course


class Quiz(models.Model):
    """Quiz asociado a un curso específico."""
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Fácil'),
        ('medium', 'Medio'),
        ('hard', 'Difícil'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="quizzes")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    passing_score = models.FloatField(default=70.0)
    xp_reward = models.PositiveIntegerField(default=50)
    time_limit = models.PositiveIntegerField(default=10, help_text="Tiempo límite en minutos")
    is_active = models.BooleanField(default=True)
    max_attempts = models.PositiveIntegerField(default=3, help_text="Número máximo de intentos permitidos")
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quizzes_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["course", "title"]
        verbose_name_plural = "Quizzes"
        indexes = [
            models.Index(fields=['course', 'is_active']),
            models.Index(fields=['difficulty', 'is_active']),
        ]

    def __str__(self):
        return f"{self.title} ({self.course.title})"

    @property
    def question_count(self):
        return self.questions.count()

    @property
    def average_score(self):
        from django.db.models import Avg
        avg = self.attempts.filter(passed=True).aggregate(avg_score=Avg('score'))
        return avg['avg_score'] or 0

    @property
    def completion_rate(self):
        total_attempts = self.attempts.count()
        if total_attempts == 0:
            return 0
        passed_attempts = self.attempts.filter(passed=True).count()
        return (passed_attempts / total_attempts) * 100


class Question(models.Model):
    """Preguntas asociadas a un quiz."""
    
    QUESTION_TYPES = [
        ('multiple_choice', 'Selección múltiple'),
        ('true_false', 'Verdadero/Falso'),
        ('short_answer', 'Respuesta corta'),
    ]
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    options = models.JSONField(default=list, help_text="Lista de opciones para preguntas de selección múltiple")
    correct_answer = models.CharField(max_length=255, help_text="Respuesta correcta")
    explanation = models.TextField(blank=True, null=True, help_text="Explicación de la respuesta correcta")
    order = models.PositiveIntegerField(default=0, help_text="Orden de la pregunta en el quiz")
    
    class Meta:
        ordering = ["quiz", "order"]
        indexes = [
            models.Index(fields=['quiz', 'order']),
        ]

    def __str__(self):
        return f"{self.quiz.title} - {self.text[:50]}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.question_type == 'multiple_choice' and len(self.options) < 2:
            raise ValidationError("Las preguntas de selección múltiple deben tener al menos 2 opciones.")


class QuizAttempt(models.Model):
    """Intento de un usuario al responder un quiz."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_attempts")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    score = models.FloatField(default=0.0)
    passed = models.BooleanField(default=False)
    answers = models.JSONField(default=dict, help_text="Respuestas del usuario en formato JSON")
    time_taken = models.PositiveIntegerField(default=0, help_text="Tiempo tomado en segundos")
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-completed_at"]
        unique_together = ["user", "quiz"]
        indexes = [
            models.Index(fields=['user', 'quiz']),
            models.Index(fields=['completed_at']),
        ]

    def __str__(self):
        status = "Aprobado" if self.passed else "Reprobado"
        return f"{self.user.email} - {self.quiz.title} ({self.score}%) - {status}"

    def evaluate(self, user_answers):
        """Evalúa las respuestas del usuario y calcula el score."""
        total_questions = self.quiz.questions.count()
        if total_questions == 0:
            self.score = 0
            self.passed = False
            self.save()
            return

        correct_answers = 0
        detailed_answers = {}
        
        for question in self.quiz.questions.all():
            user_answer = user_answers.get(str(question.id), '')
            is_correct = self._check_answer(question, user_answer)
            
            if is_correct:
                correct_answers += 1
                
            detailed_answers[str(question.id)] = {
                'user_answer': user_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
                'explanation': question.explanation
            }

        self.score = (correct_answers / total_questions) * 100
        self.passed = self.score >= self.quiz.passing_score
        self.answers = detailed_answers
        self.save()

        # Otorgar XP si aprueba
        if self.passed:
            self.user.add_xp(self.quiz.xp_reward, source="quiz")

    def _check_answer(self, question, user_answer):
        """Verifica si la respuesta del usuario es correcta."""
        if question.question_type == 'true_false':
            return user_answer.lower() == question.correct_answer.lower()
        elif question.question_type == 'multiple_choice':
            return user_answer == question.correct_answer
        else:  # short_answer
            return user_answer.strip().lower() == question.correct_answer.strip().lower()

    @property
    def attempt_number(self):
        """Número de intento para este usuario y quiz"""
        return QuizAttempt.objects.filter(
            user=self.user, 
            quiz=self.quiz,
            completed_at__lt=self.completed_at
        ).count() + 1

    @property
    def can_retake(self):
        """Verifica si el usuario puede volver a intentar el quiz"""
        if self.passed:
            return False
        return self.attempt_number < self.quiz.max_attempts