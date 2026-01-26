from django.shortcuts import render

from rest_framework import mixins, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction, IntegrityError
from .models import Comment, Like
from .serializers import CommentSerializer, LikeSerializer
from .permissions import IsOwnerOrReadOnly

class CommentViewSet(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin, 
                     mixins.DestroyModelMixin, 
                     viewsets.GenericViewSet):
    """
    Handles:
    GET /api/comments/{id}/    -> View a single comment
    PATCH /api/comments/{id}/  -> Update a comment
    DELETE /api/comments/{id}/ -> Delete a comment
    """

    queryset = Comment.objects.all().order_by("-created_at")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        GET /api/comments/me
        Optional: ?post=<post_id>
        """
        qs = self.get_queryset().filter(user=request.user)
        post_id = request.query_params.get("post")
        if post_id:
            qs = qs.filter(post_id=post_id)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

class LikeViewSet(viewsets.GenericViewSet):
    queryset = Like.objects.all().order_by("-created_at")   
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LikeSerializer

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        GET /api/likes/me
        Logic: If like exists, delete it (unlike). If not, create it (like).
        """
        qs = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


        
