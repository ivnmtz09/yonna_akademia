from django.contrib import admin
from .models import Quiz, Question, Answer, QuizResult

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 2


class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ("id", "quiz", "text")
    search_fields = ("text",)
    list_filter = ("quiz",)


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "lesson", "created_at")
    search_fields = ("title", "course__title")
    list_filter = ("course", "created_at")


admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer)
admin.site.register(QuizResult)
