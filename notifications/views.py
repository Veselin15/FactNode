from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API to retrieve notifications.
    Standard 'list' and 'retrieve' actions are provided by ReadOnlyModelViewSet.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # IMPORTANT: Only show notifications for the logged-in user!
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """
        Custom endpoint: POST /api/notifications/{id}/mark_read/
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """
        Custom endpoint: POST /api/notifications/mark_all_read/
        """
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})