from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet, LikeViewSet

router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'likes', LikeViewSet, basename='like')

urlpatterns = [
    path('', include(router.urls)),
]

