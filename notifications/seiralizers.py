from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer to display notifications to the user.
    """
    # Helper to show a readable string for the target (e.g., "Fact: Cats are liquids")
    target_preview = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message',
            'is_read', 'created_at', 'target_preview'
        ]
        read_only_fields = fields # Notifications are system-generated, users can't edit text

    def get_target_preview(self, obj):
        if obj.target:
            return str(obj.target)
        return None