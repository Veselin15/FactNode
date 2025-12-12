from rest_framework import serializers
from .models import Vote

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'vote_type', 'fact', 'created_at']
        read_only_fields = ['user', 'fact']