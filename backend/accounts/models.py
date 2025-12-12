from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    It is highly recommended to set up a custom user model at the start of a project,
    even if the default User model is sufficient for now.
    This allows for easier future customization (e.g., adding fields or changing login methods).
    """
    email = models.EmailField(_('email address'), unique=True)

    # Verification flag to ensure users are real before they can post facts
    is_verified = models.BooleanField(
        default=False,
        help_text="Designates whether this user has verified their email address."
    )

    def __str__(self):
        return self.username


class Profile(models.Model):
    """
    User Profile model containing public information and platform-specific data.
    Separating Profile from User adheres to the 'Separation of Concerns' principle:
    - User model handles authentication (auth).
    - Profile model handles user persona and application logic (reputation, bio, etc.).
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    # Public Profile Information
    avatar = models.ImageField(
        upload_to='avatars/',
        default='avatars/default.png',
        blank=True,
        help_text="User's profile picture."
    )
    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text="A short biography or introduction."
    )
    location = models.CharField(max_length=30, blank=True)
    website = models.URLField(max_length=200, blank=True)

    reputation_score = models.IntegerField(
        default=0,
        help_text="Total reputation points earned from approved facts and community votes."
    )

    # Statistics (Cached counts for performance optimization)
    facts_posted_count = models.PositiveIntegerField(default=0)
    facts_approved_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile ({self.reputation_score} rep)"

    @property
    def rank_title(self):
        """
        Returns the user's rank title based on their reputation score.
        Useful for displaying badges or titles in the frontend.
        """
        score = self.reputation_score
        if score < 10:
            return "Novice"
        elif score < 50:
            return "Curious Mind"
        elif score < 200:
            return "Researcher"
        elif score < 1000:
            return "Scholar"
        else:
            return "Professor"


# --- SIGNALS (Automation) ---

@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal receiver that creates a Profile instance automatically
    whenever a new CustomUser is created.
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal receiver that saves the Profile instance whenever the User is saved.
    Ensures the relationship remains consistent.
    """
    instance.profile.save()