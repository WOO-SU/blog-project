from django.test import TestCase

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.posts.models import Post
from apps.interactions.models import Comment, Like

User = get_user_model()

class InteractionTests(APITestCase):
    def setUp(self):
        # 1. Create two users
        self.user_a = User.objects.create_user(username='user_a', password='password123')
        self.user_b = User.objects.create_user(username='user_b', password='password123')

        # 2. Create a post (User A's post)
        self.post = Post.objects.create(user=self.user_a, title="Test Post", content="Content")

        # 3. URLs (We use 'reverse' so we don't hardcode paths like /api/...)
        self.comment_url = reverse('comment-list') # Assuming router name is 'comment'
        self.like_url = reverse('likes-toggle')    # Action name from ViewSet

    def test_toggle_like(self):
        """Test that hitting the endpoint twice toggles the like"""
        self.client.force_authenticate(user=self.user_a)
        data = {'post_id': self.post.id}

        # First hit: LIKE
        response = self.client.post(self.like_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 1)

        # Second hit: UNLIKE
        response = self.client.post(self.like_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.count(), 0)

    def test_create_comment(self):
        """Test creating a comment"""
        self.client.force_authenticate(user=self.user_b)
        data = {'post': self.post.id, 'content': 'Nice post!'}
        
        response = self.client.post(self.comment_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        comment = Comment.objects.get(post=self.post, user=self.user_b)
        self.assertEqual(comment.content, 'Nice post!')

    def test_edit_comment_permission(self):
        """Test that User A cannot edit User B's comment"""
        # 1. User B makes a comment
        comment = Comment.objects.create(user=self.user_b, post=self.post, content="Original")
        
        # 2. Login as User A (The Attacker)
        self.client.force_authenticate(user=self.user_a)
        
        # 3. Try to PATCH User B's comment
        url = reverse('comment-detail', args=[comment.id])
        response = self.client.patch(url, {'content': 'Hacked!'}, format='json')

        # 4. Expect Forbidden (403)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # 5. Verify DB didn't change
        comment.refresh_from_db()
        self.assertEqual(comment.content, "Original")
