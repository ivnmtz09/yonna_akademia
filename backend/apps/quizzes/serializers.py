from rest_framework import serializers
from .models import Quiz, Question, QuizAttempt


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "options"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id", "title", "description", "course", "course_title",
            "passing_score", "xp_reward", "questions", "created_by", "created_at"
        ]
        read_only_fields = ["created_by", "created_at"]


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ["id", "quiz", "quiz_title", "score", "passed", "completed_at"]
        read_only_fields = ["id", "passed", "completed_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        quiz = validated_data["quiz"]
        score = validated_data["score"]

        attempt = QuizAttempt.objects.create(user=user, quiz=quiz, score=score)
        attempt.evaluate()  # Calcula si aprueba y otorga XP automáticamente
        return attempt
