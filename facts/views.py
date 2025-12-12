from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Fact, Category
from .serializers import FactSerializer, CategorySerializer
from .choices import FactStatus
from .permissions import IsReputationModerator

class FactViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows facts to be viewed or created.
    """
    serializer_class = FactSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Professional Filtering & Searching
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'author__username']  # Filter by category or user
    search_fields = ['title', 'content']  # Search text
    ordering_fields = ['created_at', 'upvotes_count']  # Sort by date or popularity

    def get_queryset(self):
        """
        Custom logic:
        - Regular users see only APPROVED facts.
        - Authors can see their own Pending/Draft facts.
        """
        user = self.request.user

        # Public feed (Approved only)
        queryset = Fact.objects.filter(status=FactStatus.APPROVED)

        # If user is logged in, include their own drafts/pending facts
        if user.is_authenticated:
            my_facts = Fact.objects.filter(author=user)
            # Combine the two querysets (Distinct to avoid duplicates)
            queryset = (queryset | my_facts).distinct()

        return queryset.select_related('author', 'category').prefetch_related('sources')

    def perform_create(self, serializer):
        """
        When creating a fact, set the author to the current user.
        """
        serializer.save(author=self.request.user)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for categories (used for filters in frontend).
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ModerationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Special Interface for High-Rank Users (Researchers+).
    Shows a queue of facts waiting for approval.
    """
    serializer_class = FactSerializer
    permission_classes = [IsReputationModerator]  # <--- Secure this endpoint!

    def get_queryset(self):
        # Show only facts that are waiting for review
        return Fact.objects.filter(status=FactStatus.PENDING).order_by('created_at')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """
        Endpoint: POST /api/facts/moderation/{id}/approve/
        """
        fact = self.get_object()
        fact.status = FactStatus.APPROVED
        fact.approved_by = request.user  # (Optional: if you add this field later)
        fact.save()

        # Note: Your signals.py will automatically trigger the
        # "Fact Approved" notification here!

        return Response({'status': 'Fact approved successfully'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        Endpoint: POST /api/facts/moderation/{id}/reject/
        Body: {"reason": "Duplicate content"}
        """
        fact = self.get_object()
        fact.status = FactStatus.REJECTED

        # Save rejection reason if provided
        reason = request.data.get('reason', '')
        if reason:
            fact.rejection_reason = reason

        fact.save()
        return Response({'status': 'Fact rejected'})