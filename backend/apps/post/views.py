from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response


from .models import Post
from .serializers import PostSerializer

class IsOwnerOrReadOnly(BasePermission):
    """
    GET/HEAD/OPTIONS: 허용 (피드/상세 조회)
    PATCH/PUT/DELETE: 작성자(=user)만 허용 (수정/삭제)
    POST: IsAuthenticatedOrReadOnly가 로그인 여부로 제어
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
    
class PostViewSet(ModelViewSet):
    """
    글 작성 -> Post, api, posts
    author_id=request.user.id
    create_at 자동
    content 저장

    글 수정 -> patch, api, posts, post_id
    authotr=request.user ( 권한 검사 )
    updated_by=request.user
    updated_at 자동
    content 수정

    글 삭제 -> delete, api, posts, post_id
    author=request.user ( 권한 검사 )
    삭제 재확인 : 프론트에서 처리/ 백엔드에서는 삭제만 수행 

    글 상세 조회 -> get, api, posts, post_id
    전체 내용 조회
    """

    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # IsAuthenticated : 권한 인증된 모든 사용자 접근 하용/ 인증x면 접근 거부 
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=False, methods=["get"], url_path="me", permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        GET/ posts/me/
        로그인한 사용자의 글만 반환
        """
        qs=self.get_queryset().filter(user=request.user)
        serializer=self.get_serializer(qs, many=True)
        return Response(serializer.data)