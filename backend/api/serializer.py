from dataclasses import field
from rest_framework import serializers
from .models import User, Chat, Message


class UserSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True)
    class Meta:
        model= User
        fields= ['id', 'name','username', 'password', 'picture']
        extra_kwargs={'password': {'write_only': True}}

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()

class RegisterSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
    name=serializers.CharField()
    picture=serializers.CharField(max_length=None)

class ChatSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    admin = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'name', 'users', 'admin', 'picture_path', 'created_at', 'edited_at')

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    chatId = ChatSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ('id', 'sender', 'chatId', 'text', 'created_at', 'edited_at')