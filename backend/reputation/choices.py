from django.db import models
from django.utils.translation import gettext_lazy as _

class VoteType(models.TextChoices):
    """
    Defines the direction of a vote.
    """
    UPVOTE = 'UP', _('Upvote')
    DOWNVOTE = 'DOWN', _('Downvote')

class ReputationAction(models.TextChoices):
    """
    Defines the reason why a user's reputation changed.
    This creates an audit trail.
    """
    FACT_APPROVED = 'FACT_APPROVED', _('Fact Approved')
    FACT_REJECTED = 'FACT_REJECTED', _('Fact Rejected')
    VOTE_RECEIVED = 'VOTE_RECEIVED', _('Received Vote on Fact')
    VOTE_GIVEN = 'VOTE_GIVEN', _('Voted on Fact')
    BONUS = 'BONUS', _('Admin Bonus')