from rest_framework import serializers
from .models import XpHistory


class XpHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = XpHistory
        fields = ["id", "xp_gained", "source", "created_at"]
        read_only_fields = fields
