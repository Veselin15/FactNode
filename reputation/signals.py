from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from .models import Vote, ReputationLog
from .choices import VoteType, ReputationAction


# --- SIGNAL 1: Update Fact Counts ---
@receiver(post_save, sender=Vote)
@receiver(post_delete, sender=Vote)
def update_fact_score(sender, instance, **kwargs):
    """
    Triggers whenever a Vote is Saved or Deleted.
    It forces the Fact to recount its total upvotes and downvotes.
    """
    fact = instance.fact

    # Recalculate counts directly from the database to ensure accuracy
    fact.upvotes_count = fact.votes.filter(vote_type=VoteType.UPVOTE).count()
    fact.downvotes_count = fact.votes.filter(vote_type=VoteType.DOWNVOTE).count()

    # Save only these specific fields to optimize performance
    fact.save(update_fields=['upvotes_count', 'downvotes_count'])


# --- SIGNAL 2: Update Author Reputation ---
@receiver(post_save, sender=Vote)
def update_author_reputation(sender, instance, created, **kwargs):
    """
    Triggers when a NEW vote is cast.
    It adds or removes points from the author of the Fact.
    """
    # We only want to give reputation for NEW votes (created=True).
    # (Handling changed votes, like Up->Down, is more complex and we'll skip it for now)
    if not created:
        return

    fact = instance.fact
    author = fact.author
    profile = author.profile

    # Don't let users farm reputation by voting on their own facts!
    if instance.user == author:
        return

    score_change = 0

    # Define rules: +10 points for Upvote, -2 points for Downvote
    if instance.vote_type == VoteType.UPVOTE:
        score_change = 10
    elif instance.vote_type == VoteType.DOWNVOTE:
        score_change = -2

    if score_change != 0:
        # 1. Update the Profile Score atomically (using F expressions avoids race conditions)
        profile.reputation_score = F('reputation_score') + score_change
        profile.save()

        # 2. Create a Log entry for audit history
        ReputationLog.objects.create(
            user=author,
            action=ReputationAction.VOTE_RECEIVED,
            score_change=score_change,
            related_fact=fact
        )