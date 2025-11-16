from django.urls import path
from .views import (
    NotificationListView,
    UnreadNotificationCountView,
    MarkNotificationsReadView,
    MarkAllNotificationsReadView,
    RecentNotificationsView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('recent/', RecentNotificationsView.as_view(), name='recent-notifications'),
    path('unread-count/', UnreadNotificationCountView.as_view(), name='unread-count'),
    path('mark-read/', MarkNotificationsReadView.as_view(), name='mark-read'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-read'),
]