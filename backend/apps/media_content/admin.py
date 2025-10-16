from django.contrib import admin
from .models import MediaContent

@admin.register(MediaContent)
class MediaContentAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "media_type", "uploaded_by", "uploaded_at")
    search_fields = ("title", "description")
    list_filter = ("media_type", "uploaded_at")
