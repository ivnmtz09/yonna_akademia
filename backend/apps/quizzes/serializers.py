from rest_framework import serializers
from .models import Quiz, Question, QuizAttempt
from apps.courses.models import Enrollment


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "question_type", "options", "order", "explanation"]
        read_only_fields = ["id"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    question_count = serializers.ReadOnlyField()
    average_score = serializers.ReadOnlyField()
    completion_rate = serializers.ReadOnlyField()
    user_attempts = serializers.SerializerMethodField()
    can_attempt = serializers.SerializerMethodField()
    best_score = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            "id", "title", "description", "course", "course_title", "difficulty",
            "passing_score", "xp_reward", "time_limit", "is_active", "max_attempts",
            "questions", "question_count", "average_score", "completion_rate",
            "user_attempts", "can_attempt", "best_score", "created_by", "created_at"
        ]
        read_only_fields = ["created_by", "created_at"]

    def get_user_attempts(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.attempts.filter(user=request.user).count()
        return 0

    def get_can_attempt(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Verificar si el usuario está inscrito en el curso
            is_enrolled = Enrollment.objects.filter(
                user=request.user, 
                course=obj.course
            ).exists()
            
            if not is_enrolled:
                return False
            
            # Verificar intentos máximos
            attempts_count = obj.attempts.filter(user=request.user).count()
            return attempts_count < obj.max_attempts
        return False

    def get_best_score(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            best_attempt = obj.attempts.filter(user=request.user).order_by('-score').first()
            return best_attempt.score if best_attempt else 0
        return 0


class CreateQuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Quiz
        fields = [
            "title", "description", "course", "difficulty", "passing_score",
            "xp_reward", "time_limit", "max_attempts", "questions"
        ]

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        quiz = Quiz.objects.create(**validated_data)
        
        # Crear preguntas si se proporcionan
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
            
        return quiz


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)
    course_title = serializers.CharField(source="quiz.course.title", read_only=True)
    attempt_number = serializers.ReadOnlyField()
    can_retake = serializers.ReadOnlyField()

    class Meta:
        model = QuizAttempt
        fields = [
            "id", "quiz", "quiz_title", "course_title", "score", "passed", 
            "time_taken", "answers", "attempt_number", "can_retake", "completed_at"
        ]
        read_only_fields = ["id", "passed", "completed_at"]


class SubmitQuizSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    answers = serializers.JSONField()
    time_taken = serializers.IntegerField(min_value=0)

    def validate_quiz_id(self, value):
        try:
            quiz = Quiz.objects.get(id=value, is_active=True)
        except Quiz.DoesNotExist:
            raise serializers.ValidationError("Quiz no encontrado o inactivo")
        return value

    def validate_answers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Las respuestas deben ser un objeto JSON")
        return value

    def validate(self, attrs):
        quiz = Quiz.objects.get(id=attrs['quiz_id'])
        user = self.context['request'].user
        
        # Verificar inscripción en el curso
        if not Enrollment.objects.filter(user=user, course=quiz.course).exists():
            raise serializers.ValidationError("No estás inscrito en este curso")
        
        # Verificar intentos máximos
        attempts_count = QuizAttempt.objects.filter(user=user, quiz=quiz).count()
        if attempts_count >= quiz.max_attempts:
            raise serializers.ValidationError("Has alcanzado el número máximo de intentos para este quiz")
        
        return attrs


class QuizStatisticsSerializer(serializers.Serializer):
    total_quizzes = serializers.IntegerField()
    total_attempts = serializers.IntegerField()
    average_score = serializers.FloatField()
    pass_rate = serializers.FloatField()
    popular_quizzes = serializers.ListField()