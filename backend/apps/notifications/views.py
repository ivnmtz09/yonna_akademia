from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """Lista todas las notificaciones del usuario autenticado (incluye leídas/no leídas)."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user)
        # opcional: permitir ?unread=true
        unread = self.request.query_params.get("unread")
        if unread and unread.lower() in ("1", "true", "yes"):
            qs = qs.filter(is_read=False)
        return qs


class NotificationMarkAsReadView(generics.UpdateAPIView):
    """Marca una notificación como leída (PATCH)."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        notif_id = kwargs.get("pk")
        try:
            notif = Notification.objects.get(id=notif_id, user=request.user)
        except Notification.DoesNotExist:
            return Response({"error": "Notificación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        notif.mark_as_read()
        return Response({"message": "Notificación marcada como leída"}, status=status.HTTP_200_OK)
