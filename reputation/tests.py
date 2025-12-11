from django.test import TestCase
from django.contrib.auth import get_user_model
from facts.models import Fact, Category
from reputation.models import Vote
from reputation.choices import VoteType
from notifications.models import Notification

User = get_user_model()


class ReputationSystemTest(TestCase):
    def setUp(self):
        # 1. Setup Users with UNIQUE emails
        self.author = User.objects.create_user(
            username='author',
            email='author@test.com',
            password='password'
        )
        self.voter = User.objects.create_user(
            username='voter',
            email='voter@test.com',
            password='password'
        )

        # 2. Setup Category & Fact
        self.category = Category.objects.create(name="Science")
        self.fact = Fact.objects.create(
            title="Test Fact",
            content="Testing content",
            author=self.author,
            category=self.category,
            status='APPROVED'
        )

    def test_vote_updates_scores(self):
        """
        Test that an Upvote increases Fact score by 1 and Author Rep by 10.
        """
        # Action: Voter casts an upvote
        Vote.objects.create(
            user=self.voter,
            fact=self.fact,
            vote_type=VoteType.UPVOTE
        )

        # Refresh from DB to get updated values
        self.fact.refresh_from_db()
        self.author.profile.refresh_from_db()

        # Assertions
        self.assertEqual(self.fact.upvotes_count, 1)
        self.assertEqual(self.fact.score, 1)
        self.assertEqual(self.author.profile.reputation_score, 10)

    def test_rank_up_notification(self):
        """
        Test that crossing a reputation threshold triggers a notification.
        Threshold for 'Curious Mind' is 10 points.
        """
        # Initial State: Author has 0 points (Novice)

        # Action: Give the author 10 points via an upvote
        Vote.objects.create(
            user=self.voter,
            fact=self.fact,
            vote_type=VoteType.UPVOTE
        )

        # Check: Did they get the Notification?
        notifications = Notification.objects.filter(recipient=self.author, type='RANK_UP')
        self.assertTrue(notifications.exists())
        self.assertEqual(notifications.first().title, "Rank Up!")

        # Check: Is their rank title updated?
        self.assertEqual(self.author.profile.rank_title, "Curious Mind")