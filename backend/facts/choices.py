from django.db import models
from django.utils.translation import gettext_lazy as _

class FactStatus(models.TextChoices):
    """
    Status of the Fact within the review workflow.
    """
    DRAFT = 'DRAFT', _('Draft')
    PENDING = 'PENDING', _('Pending Approval')
    APPROVED = 'APPROVED', _('Approved')
    REJECTED = 'REJECTED', _('Rejected')