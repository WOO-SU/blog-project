from django.db.models import Count, Exists, OuterRef, Case, When, Value, BooleanField

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import (
    BasePermission,
    SAFE_METHODS, 
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Post
from .serializers import PostSerializer, PostListSerializer
from .pagination import PostPagination


from apps.interactions.models import Comment, Like
from apps.interactions.serializers import CommentSerializer, LikeSerializer
from apps.interactions.pagination import CommentPagination

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
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = PostPagination

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostSerializer
        return PostListSerializer

    def get_queryset(self):
        qs = Post.objects.all().order_by("-created_at")
        # Count likes 
        qs = qs.annotate(like_count=Count("like", distinct=True))  # requires related_name="likes"

        # Count comments
        qs = qs.annotate(comment_count=Count("comment", distinct=True))

        user = self.request.user
        if user.is_authenticated:
            qs = qs.annotate(
                liked_by_me=Exists(
                    Like.objects.filter(user=user, post_id=OuterRef('pk'))
                ),
                is_mine = Case(
                    When(user=user, then=Value(True)),
                    default=Value(False),
                    output_field=BooleanField(),
                ),
            )
        else:
            qs = qs.annotate(
                liked_by_me=Value(False, output_field=BooleanField()),
                is_mine=Value(False, output_field=BooleanField()),
            )


        return qs

    # IsAuthenticated : 권한 인증된 모든 사용자 접근 하용/ 인증x면 접근 거부 
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    @swagger_auto_schema(
        operation_summary="Post lists (paginated)",
        operation_description="Returns a paginated list of posts with like_count, comment_count, and liked_by_me.",
        manual_parameters=[
            openapi.Parameter("page", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Page number"),
            openapi.Parameter("page_size", openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description="Items per page"),
        ],
        responses={
            200: PostListSerializer(many=True)
        },
    )
    def list(self, request, *args, **kwargs):
        """
        GET /posts/
        Return paginated list of posts
        """
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve a post",
        operation_description="Get one post by id.",
        responses={200: PostSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        """
        GET /posts/{post_id}
        Retrieve detailed post data. Comments should be called separately.
        """
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="me", permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        GET/ posts/me/
        로그인한 사용자의 글만 반환
        """
        qs=self.get_queryset().filter(user=request.user)
        serializer=self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="comments",
        permission_classes=[IsAuthenticatedOrReadOnly],
    )
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            qs = Comment.objects.filter(post=post).select_related("user").order_by("-created_at")
            paginator = CommentPagination()
            page = paginator.paginate_queryset(qs, request, view=self)
            ser = CommentSerializer(page, many=True)
            return paginator.get_paginated_response(ser.data)

        # POST: create a comment
        ser = CommentSerializer(data=request.data, context={"request": request})
        ser.is_valid(raise_exception=True)
        ser.save(user=request.user, post=post)
        return Response(ser.data, status=201)

    @action(detail=True, methods=["post", "delete"], url_path="likes",
            permission_classes=[IsAuthenticated])
    def likes(self, request, pk=None):
        post = self.get_object()

        if request.method == "POST":
            Like.objects.get_or_create(user=request.user, post=post)
        else:
            Like.objects.filter(user=request.user, post=post).delete()

        like_count = Like.objects.filter(post=post).count()
        liked_by_me = Like.objects.filter(user=request.user, post=post).exists()
        
        return Response(
            {
                "post_id": post.id,
                "like_count": like_count,
                "liked_by_me": liked_by_me
            }, status=status.HTTP_200_OK,
        )