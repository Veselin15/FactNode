from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer to handle user sign-up.
    It ensures the password is encrypted (hashed) and not stored in plain text.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer to view and update the user's profile.
    Includes read-only fields for reputation statistics.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    rank_title = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'username', 'bio', 'location', 'website', 'avatar',
            'reputation_score', 'rank_title',
            'facts_posted_count', 'facts_approved_count'
        ]
        read_only_fields = [
            'reputation_score', 'rank_title',
            'facts_posted_count', 'facts_approved_count'
        ]