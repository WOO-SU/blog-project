from django.urls import include, path

urlpatterns = [
    path("posts/", include("apps.Post.urls"))
]