from django.contrib import admin
from .models import MediaContent, MediaCollection, MediaView


@admin.register(MediaContent)
class MediaContentAdmin(admin.ModelAdmin):
    list_display = (
        "title", "media_type", "category", "uploaded_by", 
        "is_approved", "is_featured", "is_public", "uploaded_at"
    )
    list_filter = (
        "media_type", "category", "is_approved", "is_featured", 
        "is_public", "uploaded_at", "approved_at"
    )
    search_fields = ("title", "description", "uploaded_by__email", "tags")
    readonly_fields = (
        "file_size", "uploaded_at", "updated_at", 
        "approved_at", "view_count"
    )
    list_editable = ("is_approved", "is_featured", "is_public")
    actions = ["approve_selected", "feature_selected"]
    
    fieldsets = (
        ('Información Básica', {
            'fields': (
                'title', 'description', 'media_type', 'category', 
                'file', 'thumbnail', 'tags'
            )
        }),
        ('Metadatos del Archivo', {
            'fields': ('file_size', 'duration', 'attribution', 'license')
        }),
        ('Moderación', {
            'fields': ('is_approved', 'approved_by', 'approved_at')
        }),
        ('Visibilidad', {
            'fields': ('is_featured', 'is_public')
        }),
        ('Usuario', {
            'fields': ('uploaded_by',)
        }),
        ('Estadísticas', {
            'fields': ('view_count',)
        }),
        ('Fechas', {
            'fields': ('uploaded_at', 'updated_at')
        }),
    )

    def view_count(self, obj):
        return obj.views.count()
    view_count.short_description = "Visualizaciones"

    def approve_selected(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} contenidos aprobados.")
    approve_selected.short_description = "Aprobar contenidos seleccionados"

    def feature_selected(self, request, queryset):
        for obj in queryset:
            obj.is_featured = not obj.is_featured
            obj.save()
        self.message_user(request, "Contenidos destacados actualizados.")
    feature_selected.short_description = "Alternar destacado en seleccionados"


@admin.register(MediaCollection)
class MediaCollectionAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "media_count", "is_public", "created_at")
    list_filter = ("is_public", "created_at")
    search_fields = ("title", "description", "created_by__email")
    filter_horizontal = ("media_files",)
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'description', 'is_public')
        }),
        ('Contenido', {
            'fields': ('media_files',)
        }),
        ('Usuario', {
            'fields': ('created_by',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def media_count(self, obj):
        return obj.media_files.count()
    media_count.short_description = "Número de medios"


@admin.register(MediaView)
class MediaViewAdmin(admin.ModelAdmin):
    list_display = ("media", "user", "viewed_at", "duration_watched")
    list_filter = ("viewed_at", "media__media_type")
    search_fields = ("media__title", "user__email")
    readonly_fields = ("viewed_at",)
    
    fieldsets = (
        ('Información de Visualización', {
            'fields': ('media', 'user')
        }),
        ('Duración', {
            'fields': ('duration_watched',)
        }),
        ('Fechas', {
            'fields': ('viewed_at',)
        }),
    )