from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile

class ProfileInline(admin.StackedInline):
    """
    Allows editing the Profile directly inside the User edit page.
    """
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Custom User Admin that includes the Profile inline and
    displays verification status and reputation in the list view.
    """
    inlines = (ProfileInline,)
    list_display = (
        'username',
        'email',
        'is_verified',
        'get_reputation',
        'is_staff'
    )
    list_filter = ('is_verified', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)

    def get_reputation(self, obj):
        """Helper to show reputation from the related profile."""
        return obj.profile.reputation_score
    get_reputation.short_description = 'Reputation'
