from rest_framework import serializers
from .models import MediaContent

class MediaContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaContent
        fields = "__all__"
