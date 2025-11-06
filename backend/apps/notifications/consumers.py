import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .serializers import NotificationSerializer
from .models import Notification


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if user is None or user.is_anonymous:
            await self.close()
            return

        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # enviar notificaciones no leídas al conectar
        notifs = await self.get_unread_notifications(user)
        await self.send(text_data=json.dumps({
            "type": "initial",
            "notifications": notifs
        }))

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user and not user.is_anonymous:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Opcional: el frontend puede enviar acciones por WS:
        {"action": "mark_all_read"} o {"action":"mark_read", "id": 5}
        """
        user = self.scope.get("user")
        if user is None or user.is_anonymous:
            return

        data = json.loads(text_data)
        action = data.get("action")

        if action == "mark_all_read":
            await self.mark_all_as_read(user)
            await self.send(text_data=json.dumps({"type": "marked_all_read"}))
        elif action == "mark_read":
            nid = data.get("id")
            if nid:
                await self.mark_one_as_read(user, nid)

    async def send_notification(self, event):
        """Handler para group_send; event['data'] debe ser dict serializable."""
        await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def get_unread_notifications(self, user):
        qs = Notification.objects.filter(user=user, is_read=False)
        return NotificationSerializer(qs, many=True).data

    @database_sync_to_async
    def mark_all_as_read(self, user):
        Notification.objects.filter(user=user, is_read=False).update(is_read=True)

    @database_sync_to_async
    def mark_one_as_read(self, user, nid):
        Notification.objects.filter(user=user, id=nid, user=user).update(is_read=True)
