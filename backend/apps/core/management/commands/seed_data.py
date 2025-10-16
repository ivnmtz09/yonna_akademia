from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, Lesson
from quizzes.models import Quiz, Question, Answer
from media_content.models import MediaContent
from progress.models import CourseProgress, LessonProgress, QuizProgress

User = get_user_model()

class Command(BaseCommand):
    help = "Seed initial data for testing"

    def handle(self, *args, **kwargs):
        # --- USERS ---
        admin, _ = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@example.com", "role": "admin"}
        )
        admin.set_password("admin123")
        admin.save()

        teacher, _ = User.objects.get_or_create(
            username="teacher1",
            defaults={"email": "teacher1@example.com", "role": "teacher"}
        )
        teacher.set_password("teacher123")
        teacher.save()

        student, _ = User.objects.get_or_create(
            username="student1",
            defaults={"email": "student1@example.com", "role": "student"}
        )
        student.set_password("student123")
        student.save()

        self.stdout.write(self.style.SUCCESS("Users created"))

        # --- COURSE + LESSONS ---
        course, _ = Course.objects.get_or_create(
            title="Introducción a la Cultura Wayuu",
            description="Curso básico sobre la lengua y tradiciones Wayuu.",
            teacher=teacher
        )

        lesson1, _ = Lesson.objects.get_or_create(
            course=course,
            title="Lección 1: Saludos en Wayuunaiki",
            content="Aprende los saludos básicos en Wayuunaiki."
        )

        lesson2, _ = Lesson.objects.get_or_create(
            course=course,
            title="Lección 2: Tradiciones Wayuu",
            content="Explora las tradiciones más importantes de la comunidad."
        )

        self.stdout.write(self.style.SUCCESS("Course and lessons created"))

        # --- QUIZ ---
        quiz, _ = Quiz.objects.get_or_create(
            title="Quiz básico de Wayuunaiki",
            course=course,
            lesson=lesson1
        )

        q1, _ = Question.objects.get_or_create(quiz=quiz, text="¿Cómo se dice 'hola' en Wayuunaiki?")
        Answer.objects.get_or_create(question=q1, text="Asajaa", is_correct=True)
        Answer.objects.get_or_create(question=q1, text="Waneekat", is_correct=False)

        q2, _ = Question.objects.get_or_create(quiz=quiz, text="¿Qué significa 'Anajawaa'?")
        Answer.objects.get_or_create(question=q2, text="Gracias", is_correct=True)
        Answer.objects.get_or_create(question=q2, text="Adiós", is_correct=False)

        self.stdout.write(self.style.SUCCESS("Quiz created"))

        # --- MEDIA CONTENT ---
        MediaContent.objects.get_or_create(
            title="Canto tradicional Wayuu",
            description="Grabación de un canto tradicional.",
            media_type="audio",
            file="media_content/sample_audio.mp3",  # Simulación de archivo
            uploaded_by=teacher
        )

        self.stdout.write(self.style.SUCCESS("Media content created"))

        # --- PROGRESS ---
        CourseProgress.objects.get_or_create(user=student, course=course, progress_percent=50.0)
        LessonProgress.objects.get_or_create(user=student, lesson=lesson1, completed=True)
        QuizProgress.objects.get_or_create(user=student, quiz=quiz, score=80, completed=True)

        self.stdout.write(self.style.SUCCESS("Progress created"))

        self.stdout.write(self.style.SUCCESS("Seed data completed successfully!"))
