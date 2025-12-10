from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from facts.models import Fact
from .models import Vote
from .serializers import VoteSerializer


class VoteViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VoteSerializer

    @action(detail=True, methods=['post'])
    def cast_vote(self, request, pk=None):
        # 'pk' here is the Fact ID
        fact = get_object_or_404(Fact, pk=pk)
        user = request.user
        vote_type = request.data.get('vote_type')

        # Logic to Create or Update the vote
        vote, created = Vote.objects.update_or_create(
            user=user,
            fact=fact,
            defaults={'vote_type': vote_type}
        )

        # TODO: Trigger reputation update signal here

        return Response({'status': 'vote recorded', 'type': vote.vote_type})