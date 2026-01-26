from rest_framework import serializers
from .models import Comment, Like
from apps.post.models import Post

class CommentSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    post_id = serializers.ReadOnlyField(source='post.id')
    author = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user_id', 'author', 'post_id', 'content', 'created_at']
        read_only_fields = ['id', 'user_id', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source="user.id")
    post_id = serializers.ReadOnlyField(source='post.id')

    class Meta:
        model = Like
        fields = ['id', 'user_id', 'post_id', 'created_at']
        read_only_fields = fields

