from django.shortcuts import render

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction, IntegrityError
from .models import Comment, Like
from .serializers import CommentSerializer, LikeSerializer, LikeToggleSerializer
from .permissions import IsOwnerOrReadOnly

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LikeViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LikeSerializer

    def get_serializer_class(self):
        if self.action == "toggle":
            return LikeToggleSerializer
        return LikeSerializer  # 필요하면

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """
        POST /api/likes/toggle/
        Body: {"post_id": 1}
        Logic: If like exists, delete it (unlike). If not, create it (like).
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        post_id = serializer.validated_data['post_id']
        user = request.user

        with transaction.atomic():
            like = Like.objects.filter(user=user, post_id=post_id).select_for_update().first()

            if like:
                like.delete()
                return Response({"message": "Unliked"}, status = status.HTTP_200_OK)
            else:
                Like.objects.create(user=user, post_id=post_id)
                return Response({"message": "Liked"}, status=status.HTTP_201_CREATED)
        
