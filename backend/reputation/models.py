from django.db import models
from django.conf import settings
from facts.models import Fact
from .choices import VoteType, ReputationAction


class Vote(models.Model):
    """
    Represents a user's vote on a specific fact.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    fact = models.ForeignKey(
        Fact,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    vote_type = models.CharField(
        max_length=10,
        choices=VoteType.choices,
        default=VoteType.UPVOTE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Ensures a user can only have ONE vote per fact
        unique_together = ('user', 'fact')
        indexes = [
            models.Index(fields=['user', 'fact']),
        ]

    def __str__(self):
        return f"{self.user} voted {self.vote_type} on {self.fact.id}"


class ReputationLog(models.Model):
    """
    An audit log for every change in a user's reputation.
    Instead of just changing the number in the Profile, we add a record here.
    This allows us to recalculate reputation if needed and prevents cheating.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reputation_logs'
    )
    action = models.CharField(
        max_length=50,
        choices=ReputationAction.choices
    )
    score_change = models.IntegerField(
        help_text="The amount of points added or removed (e.g., +10, -5)."
    )

    # Optional: Link to the specific fact that caused the change
    related_fact = models.ForeignKey(
        Fact,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reputation_impacts'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user}: {self.score_change} ({self.action})"