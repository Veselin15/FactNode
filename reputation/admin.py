from django.contrib import admin
from .models import Vote, ReputationLog


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'vote_type', 'fact', 'created_at')
    list_filter = ('vote_type', 'created_at')
    search_fields = ('user__username', 'fact__title')


@admin.register(ReputationLog)
class ReputationLogAdmin(admin.ModelAdmin):
    """
    Audit log for reputation changes.
    Read-only fields prevent accidental tampering with the history.
    """
    list_display = ('user', 'action', 'score_change', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('user__username',)

    # Usually, logs should be immutable (read-only)
    readonly_fields = ('user', 'action', 'score_change', 'related_fact', 'created_at')