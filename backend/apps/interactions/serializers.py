from rest_framework import serializers
from .models import Comment, Like
from apps.posts.models import Post

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['user'] 

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    post = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = fields

class LikeToggleSerializer(serializers.Serializer):
    """
    Input serializer for POST /api/likes/toggle/
    Body: {"post_id": 1}
    """
    post_id = serializers.IntegerField()

    def validate_post_id(self, value: int) -> int:
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post not found.")
        return value
