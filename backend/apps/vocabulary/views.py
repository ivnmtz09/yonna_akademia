from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import serializers, viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.permissions import IsModeratorOrAdminOrReadOnly
from .models import VocabularyCategory, VocabularyEntry, UserVocabularyProgress


# ──────────────────────────────────────────────────────────────────────────────
# Serializers
# ──────────────────────────────────────────────────────────────────────────────

class VocabularyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabularyCategory
        fields = ["id", "name", "slug", "description", "icon", "order"]


class UsageExampleSerializer(serializers.Serializer):
    """Sub-serializer documentativo para los ejemplos JSON."""
    spanish = serializers.CharField()
    wayuunaiki = serializers.CharField()
    context = serializers.CharField(required=False, allow_blank=True)


class VocabularyEntrySerializer(serializers.ModelSerializer):
    category = VocabularyCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=VocabularyCategory.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )
    usage_examples = UsageExampleSerializer(many=True, required=False)

    class Meta:
        model = VocabularyEntry
        fields = [
            "id",
            "spanish_term",
            "wayuunaiki_translation",
            "phonetic_transcription",
            "category",
            "category_id",
            "word_type",
            "difficulty",
            "audio_pronunciation",
            "image",
            "usage_examples",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserVocabularyProgressSerializer(serializers.ModelSerializer):
    entry = VocabularyEntrySerializer(read_only=True)

    class Meta:
        model = UserVocabularyProgress
        fields = ["id", "entry", "mastery_level", "review_count", "next_review_at", "last_seen_at"]
        read_only_fields = ["id", "review_count", "last_seen_at"]


# ──────────────────────────────────────────────────────────────────────────────
# ViewSets
# ──────────────────────────────────────────────────────────────────────────────

@extend_schema(tags=["Vocabulario"])
class VocabularyCategoryViewSet(viewsets.ModelViewSet):
    queryset = VocabularyCategory.objects.all().order_by("order")
    serializer_class = VocabularyCategorySerializer
    permission_classes = [IsModeratorOrAdminOrReadOnly]


@extend_schema(tags=["Vocabulario"])
class VocabularyEntryViewSet(viewsets.ModelViewSet):
    """
    CRUD de entradas del diccionario Wayuunaiki.
    Solo moderadores y administradores pueden crear, modificar o eliminar entradas.
    Soporta filtro por categoría, dificultad y búsqueda de texto.
    """
    serializer_class = VocabularyEntrySerializer
    permission_classes = [IsModeratorOrAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["spanish_term", "wayuunaiki_translation"]
    ordering_fields = ["spanish_term", "difficulty", "created_at"]
    ordering = ["spanish_term"]

    def get_queryset(self):
        qs = (
            VocabularyEntry.objects
            .filter(is_active=True)
            .select_related("category")
        )
        # Filtros opcionales via query params
        category = self.request.query_params.get("category")
        difficulty = self.request.query_params.get("difficulty")
        word_type = self.request.query_params.get("word_type")
        featured = self.request.query_params.get("featured")

        if category:
            qs = qs.filter(category__slug=category)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        if word_type:
            qs = qs.filter(word_type=word_type)
        if featured:
            qs = qs.filter(is_featured=True)

        return qs

    @extend_schema(
        summary="Palabra del día (destacada aleatoria)",
        responses=VocabularyEntrySerializer,
    )
    @action(detail=False, methods=["get"], url_path="word-of-the-day")
    def word_of_the_day(self, request):
        entry = (
            VocabularyEntry.objects
            .filter(is_featured=True, is_active=True)
            .select_related("category")
            .order_by("?")
            .first()
        )
        if not entry:
            return Response({"detail": "No hay palabras destacadas disponibles."}, status=404)
        return Response(VocabularyEntrySerializer(entry).data)

    @extend_schema(
        summary="Mi progreso en esta palabra",
        responses=UserVocabularyProgressSerializer,
        methods=["GET", "PATCH"],
    )
    @action(
        detail=True,
        methods=["get", "patch"],
        url_path="my-progress",
        permission_classes=[permissions.IsAuthenticated]
    )
    def my_progress(self, request, pk=None):
        entry = self.get_object()
        progress, _ = UserVocabularyProgress.objects.get_or_create(
            user=request.user, entry=entry,
        )
        if request.method == "PATCH":
            serializer = UserVocabularyProgressSerializer(
                progress, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(UserVocabularyProgressSerializer(progress).data)
