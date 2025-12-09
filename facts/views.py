from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Fact, Category
from .serializers import FactSerializer, CategorySerializer
from .choices import FactStatus


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