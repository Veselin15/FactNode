from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
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

    # Configure the fields to show on the "Add User" page
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('email',)}),
    )

    def get_reputation(self, obj):
        return obj.profile.reputation_score
    get_reputation.short_description = 'Reputation'

    # --- ADD THIS METHOD ---
    def get_inlines(self, request, obj=None):
        """
        Only show the ProfileInline when EDITING a user (obj is not None).
        When creating a user (obj is None), hide it to avoid conflict with the Signal.
        """
        if not obj:
            return []
        return self.inlines