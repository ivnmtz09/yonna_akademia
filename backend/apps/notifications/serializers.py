from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'type', 'is_read', 
            'created_at', 'related_course_id', 'related_quiz_id'
        ]
        read_only_fields = fields


class NotificationMarkReadSerializer(serializers.Serializer):
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True
    )

    def validate_notification_ids(self, value):
        if not value:
            raise serializers.ValidationError("La lista no puede estar vacía")
        return value