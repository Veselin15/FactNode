from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer, ProfileSerializer
from .models import Profile

class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows anyone to create a new account.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

class CurrentUserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint that allows the logged-in user to view and edit their own profile.
    GET: View profile
    PATCH: Update bio, avatar, etc.
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Instead of looking up a user by ID in the URL,
        # we simply return the profile of the user making the request.
        return self.request.user.profile