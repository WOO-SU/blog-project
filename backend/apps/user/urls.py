from django.urls import path
from .views import LoginAPIView, LogoutAPIView

urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
]