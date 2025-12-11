from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from .models import Vote, ReputationLog
from .choices import VoteType, ReputationAction
from notifications.models import Notification
from notifications.choices import NotificationType

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
    profile = author.profile  # This fetches the current profile from DB

    if instance.user == author:
        return

    # 1. Calculate Score Change
    score_change = 0
    if instance.vote_type == VoteType.UPVOTE:
        score_change = 10
    elif instance.vote_type == VoteType.DOWNVOTE:
        score_change = -2

    if score_change == 0:
        return

    # 2. Capture OLD Rank
    # We use the property 'rank_title' which calculates based on 'reputation_score'
    old_rank = profile.rank_title

    # 3. Apply Update
    # We cannot use F() expressions here easily if we want to compare ranks immediately in Python.
    # We will update manually to check the new rank.
    profile.reputation_score += score_change
    profile.save()

    # 4. Check NEW Rank
    profile.refresh_from_db() # Reload to be safe
    new_rank = profile.rank_title

    # 5. Trigger Notification if Rank Changed
    if old_rank != new_rank and score_change > 0:
        # Only notify on promotion (score went up), not demotion
        Notification.objects.create(
            recipient=author,
            type=NotificationType.RANK_UP,
            title="Rank Up!",
            message=f"Congratulations! You have reached the rank of {new_rank}.",
            target=profile # Links to their own profile
        )

    # 6. Log the change
    ReputationLog.objects.create(
        user=author,
        action=ReputationAction.VOTE_RECEIVED,
        score_change=score_change,
        related_fact=fact
    )