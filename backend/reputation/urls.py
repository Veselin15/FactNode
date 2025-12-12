from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VoteViewSet

# Create a router and register our viewset with it.
router = DefaultRouter()

# This registers the endpoint.
# The URL will be: /api/reputation/votes/{fact_id}/cast_vote/
router.register(r'votes', VoteViewSet, basename='vote')

urlpatterns = [
    path('', include(router.urls)),
]