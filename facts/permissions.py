from rest_framework import permissions


class IsReputationModerator(permissions.BasePermission):
    """
    Allows access only to users with a reputation rank of Researcher (50+) or higher.
    """

    def has_permission(self, request, view):
        # 1. User must be logged in
        if not request.user or not request.user.is_authenticated:
            return False

        # 2. Check reputation score
        # According to models.py: Researcher starts at 50, Scholar at 200, Professor at 1000.
        return request.user.profile.reputation_score >= 50