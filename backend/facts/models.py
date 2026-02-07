from django.db import models
from django.conf import settings
from django.utils.text import slugify
from .choices import FactStatus  # Import the choices from the separate file


class Category(models.Model):
    """
    Represents a broad topic for facts (e.g., Biology, Space, History).
    Uses a slug for SEO-friendly URLs.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    icon_name = models.CharField(
        max_length=50,
        blank=True,
        help_text="Name of the icon from the frontend library (e.g., 'fa-atom')"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Fact(models.Model):
    """
    The core model representing a scientific fact or interesting snippet.
    Includes status management for the moderation workflow.
    """
    title = models.CharField(max_length=200, help_text="A concise and catchy title")
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    content = models.TextField(help_text="Full description of the fact")
    image = models.ImageField(
        upload_to='fact_images/',
        blank=True,
        null=True,
        help_text="Optional image to make the fact more engaging."
    )

    # Relationships
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='facts'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='facts'
    )

    # Status and Workflow
    status = models.CharField(
        max_length=10,
        choices=FactStatus.choices,
        default=FactStatus.DRAFT,
        db_index=True  # Index for faster filtering by status
    )
    rejection_reason = models.TextField(
        blank=True,
        null=True,
        help_text="Reason for rejection (if applicable)"
    )

    # Denormalized counters for performance (avoids expensive COUNT queries)
    upvotes_count = models.PositiveIntegerField(default=0)
    downvotes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            # Compound index for retrieving the latest approved facts efficiently
            models.Index(fields=['status', '-created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate a slug from the title if not provided
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def score(self):
        """Calculates the net score of the fact."""
        return self.upvotes_count - self.downvotes_count

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class FactSource(models.Model):
    """
    Represents an external source/reference for a specific fact.
    A fact can have multiple sources for verification.
    """
    fact = models.ForeignKey(Fact, on_delete=models.CASCADE, related_name='sources')
    url = models.URLField()
    description = models.CharField(
        max_length=200,
        blank=True,
        help_text="Short description (e.g., 'Article in Nature')"
    )
    is_verified_source = models.BooleanField(
        default=False,
        help_text="Indicates if the domain is considered authoritative by the platform"
    )

    def __str__(self):
        return self.url


class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    fact = models.ForeignKey(Fact, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'fact')  # Prevent duplicate bookmarks

    def __str__(self):
        return f"{self.user} bookmarked {self.fact}"
class Comment(models.Model):
    """
    Represents a user review or discussion on a fact.
    """
    fact = models.ForeignKey(Fact, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    # Allows for nested replies (optional, but good for discussions)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.fact.title}"