from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'type', 'title', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('recipient__username', 'title', 'message')

    actions = ['mark_as_read']

    @admin.action(description='Mark selected notifications as read')
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)