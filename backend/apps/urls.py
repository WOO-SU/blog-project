from django.urls import include, path

urlpatterns = [
    path("user/", include("apps.user.urls")),
    path("posts/", include("apps.Post.urls")),
    path("interactions/", include("apps.interactions.urls")),
]
