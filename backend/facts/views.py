from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Fact, Category, Bookmark
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
    filterset_fields = ['category__slug', 'author__username']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'upvotes_count']

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

    # --- MOVED OUTSIDE OF get_queryset ---

    # 1. Action to Toggle Bookmark (POST /api/facts/feed/{id}/bookmark/)
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def bookmark(self, request, pk=None):
        fact = self.get_object()
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, fact=fact)

        if not created:
            bookmark.delete()
            return Response({'status': 'unbookmarked', 'is_bookmarked': False})

        return Response({'status': 'bookmarked', 'is_bookmarked': True})

    # 2. Action to List My Bookmarks (GET /api/facts/feed/bookmarks/)
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def bookmarks(self, request):
        # Note: We query Bookmark objects, then fetch the related facts
        bookmarked_facts = Fact.objects.filter(bookmarked_by__user=request.user, status=FactStatus.APPROVED)

        page = self.paginate_queryset(bookmarked_facts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(bookmarked_facts, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for categories (used for filters in frontend).
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class ModerationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Special Interface for High-Rank Users (Researchers+).
    Shows a queue of facts waiting for approval.
    """
    serializer_class = FactSerializer
    permission_classes = [IsReputationModerator]

    def get_queryset(self):
        return Fact.objects.filter(status=FactStatus.PENDING).order_by('created_at')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        fact = self.get_object()
        fact.status = FactStatus.APPROVED
        fact.approved_by = request.user
        fact.save()
        return Response({'status': 'Fact approved successfully'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        fact = self.get_object()
        fact.status = FactStatus.REJECTED
        reason = request.data.get('reason', '')
        if reason:
            fact.rejection_reason = reason
        fact.save()
        return Response({'status': 'Fact rejected'})