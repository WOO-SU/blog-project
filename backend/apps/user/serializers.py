from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class LoginResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()