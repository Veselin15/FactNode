from django.test import TestCase
from django.contrib.auth import get_user_model
from facts.models import Fact, Category, FactStatus
from notifications.models import Notification

User = get_user_model()


class FactModerationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.category = Category.objects.create(name="History")

    def test_fact_stats_tracking(self):
        """
        Test that creating a fact updates 'facts_posted_count'
        and approving it updates 'facts_approved_count'.
        """
        # 1. User posts a draft
        fact = Fact.objects.create(
            title="Ancient Rome",
            content="Content here",
            author=self.user,
            category=self.category,
            status=FactStatus.DRAFT
        )

        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.facts_posted_count, 1)
        self.assertEqual(self.user.profile.facts_approved_count, 0)

        # 2. Admin approves the fact
        fact.status = FactStatus.APPROVED
        fact.save()

        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.facts_approved_count, 1)

    def test_approval_notification(self):
        """
        Test that approving a fact sends a notification to the author.
        """
        fact = Fact.objects.create(
            title="Notification Test",
            author=self.user,
            category=self.category,
            status=FactStatus.PENDING
        )

        # Action: Approve
        fact.status = FactStatus.APPROVED
        fact.save()

        # Assert: Check Notification
        notification = Notification.objects.filter(recipient=self.user).first()
        self.assertIsNotNone(notification)
        self.assertEqual(notification.type, 'FACT_APPROVED')
        self.assertIn("Notification Test", notification.message)