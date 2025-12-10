from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.db.models import F
from .models import Fact
from .choices import FactStatus


# --- 1. Update Total Posted Count ---

@receiver(post_save, sender=Fact)
def increment_posted_count(sender, instance, created, **kwargs):
    """
    When a user creates a new fact (Draft or otherwise), increment their posted count.
    """
    if created:
        profile = instance.author.profile
        profile.facts_posted_count = F('facts_posted_count') + 1
        profile.save(update_fields=['facts_posted_count'])


@receiver(post_delete, sender=Fact)
def decrement_posted_count(sender, instance, **kwargs):
    """
    If a fact is deleted, decrement the count.
    """
    profile = instance.author.profile
    # Prevent negative numbers just in case
    if profile.facts_posted_count > 0:
        profile.facts_posted_count = F('facts_posted_count') - 1
        profile.save(update_fields=['facts_posted_count'])


# --- 2. Update Approved Count (Tricky Part) ---

@receiver(pre_save, sender=Fact)
def track_old_status(sender, instance, **kwargs):
    """
    Before saving, we check what the status WAS so we can compare it later.
    """
    if instance.pk:
        try:
            old_instance = Fact.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Fact.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Fact)
def update_approved_count(sender, instance, created, **kwargs):
    """
    After saving, check if the status changed to or from APPROVED.
    """
    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status
    profile = instance.author.profile

    # Case A: Fact was just APPROVED
    if old_status != FactStatus.APPROVED and new_status == FactStatus.APPROVED:
        profile.facts_approved_count = F('facts_approved_count') + 1
        profile.save(update_fields=['facts_approved_count'])

        # (Optional) Here you could also trigger a Notification: "Your fact was approved!"

    # Case B: Fact was APPROVED but is now REJECTED (or Drafted)
    elif old_status == FactStatus.APPROVED and new_status != FactStatus.APPROVED:
        if profile.facts_approved_count > 0:
            profile.facts_approved_count = F('facts_approved_count') - 1
            profile.save(update_fields=['facts_approved_count'])