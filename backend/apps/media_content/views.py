from rest_framework import viewsets
from .models import MediaContent
from .serializers import MediaContentSerializer
from apps.users.permissions import IsAdmin, IsTeacher

class MediaContentViewSet(viewsets.ModelViewSet):
    queryset = MediaContent.objects.all()
    serializer_class = MediaContentSerializer
    permission_classes = [IsTeacher | IsAdmin]
