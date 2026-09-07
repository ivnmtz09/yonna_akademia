from rest_framework import serializers
from .models import Quiz, Question, QuizAttempt
from apps.courses.models import Enrollment


# ──────────────────────────────────────────────────────────────────────────────
# JSONField: estructura de opciones validada en Python
# ──────────────────────────────────────────────────────────────────────────────

class QuestionOptionSerializer(serializers.Serializer):
    """
    Sub-serializer que documenta y valida la estructura del JSONField `options`
    del modelo Question.

    Ventaja frente a una tabla intermedia (QuestionOption):
      - Sin JOINs adicionales al consultar preguntas
      - Flexible: añadir campos (imagen, audio) sin migración
      - Consultable con operadores JSON nativos de PostgreSQL:
          Question.objects.filter(options__contains=[{"is_correct": True}])

    Estructura esperada en `options`:
    [
      {"id": "a", "text": "Taya", "is_correct": true},
      {"id": "b", "text": "Wayuu", "is_correct": false},
      {"id": "c", "text": "Ouuya", "is_correct": false}
    ]
    """
    id = serializers.CharField(
        max_length=10,
        help_text="Identificador de la opción (ej: 'a', 'b', 'c').",
    )
    text = serializers.CharField(help_text="Texto de la opción de respuesta.")
    is_correct = serializers.BooleanField(
        help_text="True si esta es la respuesta correcta.",
    )
    audio_url = serializers.URLField(
        required=False,
        allow_blank=True,
        help_text="URL opcional a un audio de pronunciación para la opción.",
    )


class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer de Question.
    Valida que el JSONField `options` tenga exactamente 1 opción correcta
    cuando el tipo es 'multiple_choice'.
    """
    # Mostramos las opciones como lista de objetos tipados
    options = QuestionOptionSerializer(many=True, required=False, default=list)

    class Meta:
        model = Question
        fields = ["id", "text", "question_type", "options", "order", "explanation"]
        read_only_fields = ["id"]

    def to_representation(self, instance):
        if isinstance(instance.options, list) and instance.options and isinstance(instance.options[0], str):
            instance.options = [
                {"id": chr(ord('a') + i), "text": opt, "is_correct": (opt.strip().lower() == instance.correct_answer.strip().lower())}
                for i, opt in enumerate(instance.options)
            ]
        return super().to_representation(instance)

    def validate(self, attrs):
        question_type = attrs.get("question_type", "multiple_choice")
        options = attrs.get("options", [])

        if question_type == "multiple_choice":
            if len(options) < 2:
                raise serializers.ValidationError(
                    {"options": "Las preguntas de selección múltiple deben tener al menos 2 opciones."}
                )
            correct_count = sum(1 for opt in options if opt.get("is_correct"))
            if correct_count != 1:
                raise serializers.ValidationError(
                    {"options": "Debe existir exactamente 1 opción marcada como correcta."}
                )

        if question_type == "true_false":
            if len(options) != 2:
                raise serializers.ValidationError(
                    {"options": "Las preguntas Verdadero/Falso deben tener exactamente 2 opciones."}
                )

        return attrs


# ──────────────────────────────────────────────────────────────────────────────
# Quiz
# ──────────────────────────────────────────────────────────────────────────────

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
            "user_attempts", "can_attempt", "best_score", "created_by", "created_at",
        ]
        read_only_fields = ["created_by", "created_at"]

    def get_user_attempts(self, obj) -> int:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            # Usa el to_attr si ya viene de un Prefetch, evitando N+1
            user_attempts_cache = getattr(obj, "user_attempts_cache", None)
            if user_attempts_cache is not None:
                return len(user_attempts_cache)
            return obj.attempts.filter(user=request.user).count()
        return 0

    def get_can_attempt(self, obj) -> bool:
        request = self.context.get("request")
        if not (request and request.user.is_authenticated):
            return False
        is_enrolled = Enrollment.objects.filter(
            user=request.user, course=obj.course
        ).exists()
        if not is_enrolled:
            return False
        attempts_count = obj.attempts.filter(user=request.user).count()
        return attempts_count < obj.max_attempts

    def get_best_score(self, obj) -> float:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            best = obj.attempts.filter(user=request.user).order_by("-score").first()
            return best.score if best else 0.0
        return 0.0


class CreateQuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Quiz
        fields = [
            "title", "description", "course", "difficulty", "passing_score",
            "xp_reward", "time_limit", "max_attempts", "is_active", "questions",
        ]

    def validate(self, attrs):
        course = attrs.get("course")
        if course and not course.is_active:
            raise serializers.ValidationError(
                "No puedes crear quizzes en cursos inactivos."
            )
        return attrs

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        quiz = Quiz.objects.create(**validated_data)
        Question.objects.bulk_create([
            Question(
                quiz=quiz,
                order=q_data.get("order", idx),
                **{k: v for k, v in q_data.items() if k != "order"},
            )
            for idx, q_data in enumerate(questions_data)
        ])
        return quiz


# ──────────────────────────────────────────────────────────────────────────────
# Intento de Quiz
# ──────────────────────────────────────────────────────────────────────────────

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)
    course_title = serializers.CharField(source="quiz.course.title", read_only=True)
    attempt_number = serializers.ReadOnlyField()
    can_retake = serializers.ReadOnlyField()

    class Meta:
        model = QuizAttempt
        fields = [
            "id", "quiz", "quiz_title", "course_title", "score", "passed",
            "time_taken", "answers", "attempt_number", "can_retake", "completed_at",
        ]
        read_only_fields = ["id", "passed", "completed_at"]


class SubmitQuizSerializer(serializers.Serializer):
    """
    `answers` es un JSONField: mapa de question_id → respuesta elegida.

    Ejemplo:
    {
      "quiz_id": 3,
      "time_taken": 120,
      "answers": {
        "10": "a",
        "11": "true",
        "12": "taya"
      }
    }
    """
    quiz_id = serializers.IntegerField()
    answers = serializers.JSONField(
        help_text='Mapa {"<question_id>": "<opción_elegida>"}',
    )
    time_taken = serializers.IntegerField(min_value=0)

    def validate_quiz_id(self, value):
        if not Quiz.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Quiz no encontrado o inactivo.")
        return value

    def validate_answers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "Las respuestas deben ser un objeto JSON {question_id: respuesta}."
            )
        return value

    def validate(self, attrs):
        quiz = Quiz.objects.select_related("course").get(id=attrs["quiz_id"])
        user = self.context["request"].user

        if not Enrollment.objects.filter(user=user, course=quiz.course).exists():
            raise serializers.ValidationError("No estás inscrito en este curso.")

        attempts_count = QuizAttempt.objects.filter(user=user, quiz=quiz).count()
        if attempts_count >= quiz.max_attempts:
            raise serializers.ValidationError(
                f"Has alcanzado el número máximo de intentos ({quiz.max_attempts})."
            )

        attrs["quiz"] = quiz
        return attrs


class QuizStatisticsSerializer(serializers.Serializer):
    total_quizzes = serializers.IntegerField()
    total_attempts = serializers.IntegerField()
    average_score = serializers.FloatField()
    pass_rate = serializers.FloatField()
    popular_quizzes = serializers.ListField()