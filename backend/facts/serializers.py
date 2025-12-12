from rest_framework import serializers
from .models import Fact, Category, FactSource
from accounts.models import CustomUser


# --- Helper Serializer for Author ---
class AuthorSerializer(serializers.ModelSerializer):
    """
    Minimal user info to display next to a fact.
    We don't want to expose email or password!
    """

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'is_verified']


# --- Category Serializer ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon_name']


# --- Source Serializer ---
class FactSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactSource
        fields = ['url', 'description', 'is_verified_source']


# --- Main Fact Serializer ---
class FactSerializer(serializers.ModelSerializer):
    """
    The main serializer for the News Feed.
    Uses nested serializers for rich data presentation.
    """
    category = CategorySerializer(read_only=True)
    # WRITE ONLY: Accept an ID in POST requests
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',  # Link this input to the 'category' model field
        write_only=True
    )
    author = AuthorSerializer(read_only=True)
    sources = FactSourceSerializer(many=True, read_only=True)

    # Custom field: Score calculation
    score = serializers.IntegerField(read_only=True)

    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Fact
        fields = [
            'id', 'title', 'slug', 'content', 'image',
            'category', 'category_id','author', 'sources',
            'score', 'created_at', 'status'
        ]
        read_only_fields = ['status', 'slug', 'approved_at', 'created_at']

    def create(self, validated_data):
        """
        Custom create method to handle author assignment automatically.
        """
        # The user comes from the request context (logged in user)
        user = self.context['request'].user
        fact = Fact.objects.create(author=user, **validated_data)
        return fact