from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from .serializers import LoginSerializer, LoginResponseSerializer

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: LoginResponseSerializer}
    )
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:
            return Response({'detail': '로그인 실패'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        return Response({'detail': '로그인 성공'}, status=status.HTTP_200_OK)

class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': '로그아웃 완료'})