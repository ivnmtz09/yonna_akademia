from django.contrib import admin
from .models import VocabularyCategory, VocabularyEntry, UserVocabularyProgress


@admin.register(VocabularyCategory)
class VocabularyCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["order"]


@admin.register(VocabularyEntry)
class VocabularyEntryAdmin(admin.ModelAdmin):
    list_display = [
        "spanish_term", "wayuunaiki_translation", "category",
        "word_type", "difficulty", "is_featured", "is_active",
    ]
    list_filter = ["category", "difficulty", "word_type", "is_featured", "is_active"]
    search_fields = ["spanish_term", "wayuunaiki_translation"]
    list_editable = ["is_featured", "is_active"]
    raw_id_fields = ["category"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(UserVocabularyProgress)
class UserVocabularyProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "entry", "mastery_level", "review_count", "last_seen_at"]
    list_filter = ["mastery_level"]
    search_fields = ["user__email", "entry__spanish_term"]
    raw_id_fields = ["user", "entry"]
