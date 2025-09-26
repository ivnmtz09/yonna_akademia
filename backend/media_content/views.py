from rest_framework import viewsets
from .models import MediaContent
from .serializers import MediaContentSerializer
from users.permissions import IsAdmin, IsTeacherOrReadOnly

class MediaContentViewSet(viewsets.ModelViewSet):
    queryset = MediaContent.objects.all()
    serializer_class = MediaContentSerializer
    permission_classes = [IsTeacherOrReadOnly | IsAdmin]
