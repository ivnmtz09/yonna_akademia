from rest_framework import serializers
from .models import MediaContent, MediaCollection, MediaView
from apps.users.serializers import UserSerializer


class MediaContentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True, allow_null=True)
    file_size_mb = serializers.ReadOnlyField()
    formatted_duration = serializers.ReadOnlyField()
    download_url = serializers.ReadOnlyField()
    preview_url = serializers.ReadOnlyField()
    view_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaContent
        fields = [
            "id", "title", "description", "media_type", "category",
            "file", "file_size", "file_size_mb", "duration", "formatted_duration",
            "thumbnail", "attribution", "license",
            "is_approved", "approved_by", "approved_by_name", "approved_at",
            "is_featured", "is_public",
            "uploaded_by", "uploaded_by_name", "uploaded_by_email",
            "uploaded_at", "updated_at", "tags",
            "download_url", "preview_url", "view_count"
        ]
        read_only_fields = [
            "id", "file_size", "uploaded_by", "uploaded_at", "updated_at",
            "approved_by", "approved_at", "view_count"
        ]

    def get_view_count(self, obj):
        return obj.views.count()

    def validate_file(self, value):
        """Validar el tipo de archivo según el media_type."""
        media_type = self.initial_data.get('media_type')
        
        if media_type == 'image':
            allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
        elif media_type == 'video':
            allowed_extensions = ['mp4', 'avi', 'mov', 'wmv', 'webm']
        elif media_type == 'audio':
            allowed_extensions = ['mp3', 'wav', 'ogg', 'm4a']
        elif media_type == 'document':
            allowed_extensions = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx']
        else:
            allowed_extensions = []
        
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in allowed_extensions:
            raise serializers.ValidationError(
                f"Tipo de archivo no válido para {media_type}. "
                f"Extensiones permitidas: {', '.join(allowed_extensions)}"
            )
        
        # Validar tamaño máximo (50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        if value.size > max_size:
            raise serializers.ValidationError("El archivo no puede ser mayor a 50MB")
        
        return value


class MediaContentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaContent
        fields = [
            "title", "description", "media_type", "category",
            "file", "thumbnail", "attribution", "license", "tags"
        ]


class MediaContentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaContent
        fields = [
            "title", "description", "category", "thumbnail",
            "attribution", "license", "is_public", "tags"
        ]


class MediaContentAdminSerializer(MediaContentSerializer):
    """Serializer para administradores con campos adicionales."""
    class Meta(MediaContentSerializer.Meta):
        fields = MediaContentSerializer.Meta.fields + ["is_approved", "is_featured"]


class MediaCollectionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    media_count = serializers.ReadOnlyField()
    media_files = MediaContentSerializer(many=True, read_only=True)
    
    class Meta:
        model = MediaCollection
        fields = [
            "id", "title", "description", "media_files", "media_count",
            "created_by", "created_by_name", "is_public",
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]


class MediaCollectionCreateSerializer(serializers.ModelSerializer):
    media_files = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = MediaCollection
        fields = ["title", "description", "media_files", "is_public"]

    def create(self, validated_data):
        media_files_ids = validated_data.pop('media_files', [])
        collection = MediaCollection.objects.create(**validated_data)
        
        # Agregar archivos multimedia a la colección
        if media_files_ids:
            media_files = MediaContent.objects.filter(id__in=media_files_ids, is_approved=True)
            collection.media_files.set(media_files)
        
        return collection


class MediaViewSerializer(serializers.ModelSerializer):
    media_title = serializers.CharField(source='media.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = MediaView
        fields = [
            "id", "media", "media_title", "user", "user_name",
            "viewed_at", "duration_watched"
        ]
        read_only_fields = ["id", "viewed_at"]


class MediaStatisticsSerializer(serializers.Serializer):
    total_media = serializers.IntegerField()
    total_views = serializers.IntegerField()
    media_by_type = serializers.DictField()
    media_by_category = serializers.DictField()
    most_viewed_media = serializers.ListField()
    recent_uploads = serializers.ListField()