# apps/posts/pagination.py (or apps/interactions/pagination.py)
from rest_framework.pagination import PageNumberPagination

class CommentPagination(PageNumberPagination):
    page_size = 20
    page_query_param = "comments_page"
    page_size_query_param = "comments_page_size"
    max_page_size = 100
