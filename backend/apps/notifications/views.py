from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

from .models import Notification
from .serializers import NotificationSerializer, NotificationMarkReadSerializer
from apps.users.permissions import IsAdmin, IsModerator


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Usuario solo ve sus notificaciones
        return Notification.objects.filter(user=self.request.user)


class UnreadNotificationCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user, 
            is_read=False
        ).count()
        return Response({"unread_count": count})


class MarkNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = NotificationMarkReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        notification_ids = serializer.validated_data['notification_ids']
        
        # Marcar como leídas solo las notificaciones del usuario
        updated = Notification.objects.filter(
            id__in=notification_ids,
            user=request.user
        ).update(is_read=True)
        
        return Response({
            "message": f"{updated} notificaciones marcadas como leídas",
            "updated_count": updated
        })


class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({
            "message": f"Todas las notificaciones ({updated}) marcadas como leídas",
            "updated_count": updated
        })


class RecentNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Últimas 10 notificaciones no leídas o de los últimos 7 días
        seven_days_ago = timezone.now() - timedelta(days=7)
        return Notification.objects.filter(
            user=self.request.user,
            created_at__gte=seven_days_ago
        ).order_by('-created_at')[:10]