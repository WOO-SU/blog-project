from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source="user.id")
    author = serializers.ReadOnlyField(source='user.username')  # Should be CharField, since username is variable
    comment_count = serializers.IntegerField(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    liked_by_me = serializers.BooleanField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user_id",
            'author',
            'title',
            "content",
            "created_at",
            "updated_at",
            'like_count',
            'comment_count',
            'liked_by_me',
        ]
        read_only_fields = ["id", "user_id", 'author', "created_at", "updated_at"]

class PostListSerializer(serializers.ModelSerializer):
    comment_count = serializers.IntegerField(read_only=True)
    like_count = serializers.IntegerField(read_only=True)

    class Meta: 
        model = Post
        fields = [
            'id', 
            'title', 
            'content', 
            'created_at', 
            'like_count', 
            'comment_count',
        ]
