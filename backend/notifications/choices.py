from django.db import models
from django.utils.translation import gettext_lazy as _

class NotificationType(models.TextChoices):
    """
    Categorizes the notification to determine how it should be displayed
    (e.g., green icon for success, yellow for warnings).
    """
    SYSTEM = 'SYSTEM', _('System Message')
    FACT_APPROVED = 'FACT_APPROVED', _('Fact Approved')
    FACT_REJECTED = 'FACT_REJECTED', _('Fact Rejected')
    RANK_UP = 'RANK_UP', _('New Reputation Rank')
    ACHIEVEMENT = 'ACHIEVEMENT', _('Achievement Unlocked')
    VOTE_MILESTONE = 'VOTE_MILESTONE', _('Vote Milestone Reached')