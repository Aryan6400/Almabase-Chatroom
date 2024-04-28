from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializer import *
from .permissions import *
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *


class Login(GenericAPIView):
    def post(self, request):
        try:
            data=request.data
            serializer = LoginSerializer(data=data)
            if serializer.is_valid():
                username=serializer.data['username']
                password=serializer.data['password']

                user = User.objects.get(username=username)
                if user is None:
                    return Response({
                        'status': 400,
                        'message': "User doesn't exist!",
                        'data': {}
                    })
                if check_password(password, user.password)==False:
                    return Response({
                        'status': 400,
                        'message': "Invalid Credentials!",
                        'data': {}
                    })
                refresh = RefreshToken.for_user(user)
                userDetails={
                    '_id': user.id,
                    'name': user.name,
                    'username': user.username,
                    'picture': user.picture,
                    'createdAt': user.created_at,
                    'updatedAt': user.edited_at
                }
                return Response({
                    'status': 200,
                    'message': 'Login successful',
                    'token': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    'user': userDetails
                })

            return Response({
                'status': 400,
                'message': 'Internal Server Error',
                'data': serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class Register(GenericAPIView):
    def post(self, request):
        try:
            data=request.data
            serializer = RegisterSerializer(data=data)
            if serializer.is_valid():
                username=serializer.data['username']
                password=serializer.data['password']
                name=serializer.data['name']
                picture=serializer.data['picture']

                if User.objects.filter(username=username).exists():
                    return Response({
                        'status': 400,
                        'message': 'Email already exists',
                        'data': {}
                    }, status=400)
                hashed_password = make_password(password)
                user = User.objects.create(username=username, name=name, password=hashed_password, picture=picture)
                refresh = RefreshToken.for_user(user)
                userDetails = {
                    '_id': user.id,
                    'name': user.name,
                    'username': user.username,
                    'picture': user.picture,
                    'createdAt': user.created_at,
                    'updatedAt': user.edited_at
                }
                return Response({
                    'status': 200,
                    'message': 'Registration successful',
                    'token': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    'user': userDetails
                })

            return Response({
                'status': 400,
                'message': 'Invalid Credentials',
                'data': serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class Messages(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def get(self, request, chat_id):
        try:
            try:
                group = Chat.objects.get(pk=chat_id)
            except Chat.DoesNotExist:
                return Response({'message': 'Group not found', 'status':404}, status=404)
            
            messages = Message.objects.filter(chatId=chat_id)
            if not messages.exists():
                return Response({
                    'status': 200,
                    'data': []
                }, status=200)
            serializer = MessageSerializer(messages, many=True)
            return Response({
                'status': 200,
                'data': serializer.data
            }, status=200)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


    def post(self, request, chat_id):
        try:
            text=request.data['text']
            chat = Chat.objects.get(pk=chat_id)
            if not chat:
                return Response({'message': 'Group not found!', 'status': 404}, status=404)
            sender=User.objects.get(pk=request.data['user'])
            if not sender:
                return Response({'message': 'Unauthorised User!', 'status': 401}, status=401)
            new_message = Message.objects.create(sender=sender, text=text, chatId=chat)
            serializer = MessageSerializer(new_message)
            return Response({'data':serializer.data, 'status': 201}, status=201)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class Groups(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def get(self, request):
        try:
            user=request.query_params.get('user')
            if not user:
                return Response({
                    'status': 401,
                    'message': 'User Id required!',
                }, status=401)
            chats_queryset = Chat.objects.filter(users__in=[user])
            chats_queryset = chats_queryset.prefetch_related('users', 'admin')
            chats_queryset = chats_queryset.order_by('-edited_at')

            serializer = ChatSerializer(chats_queryset, many=True)
            return Response({
                'status': 200,
                'message': 'Groups fetched successfully',
                'data': serializer.data
            }, status=200)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


    def post(self, request):
        try:
            print(request.data)
            user_ids = request.data.get('userIds')
            if not user_ids:
                user_ids=[]
            print(user_ids)
            if not all(User.objects.filter(pk=user_id).exists() for user_id in user_ids):
                return Response({'message': 'Invalid or non-existent user IDs provided', 'status': 400}, status=400)
            user = User.objects.get(pk=request.data['user'])
            user_ids.append(request.data['user'])
            group_chat = Chat.objects.create(
                name=request.data['name'],
                admin=user
            )
            for user in user_ids:
                group_chat.users.add(user)
            group_chat.save()
            populated_chat = Chat.objects.get(pk=group_chat.pk)

            serializer = ChatSerializer(populated_chat)
            return Response({
                'status': 201,
                'message': 'Group created successfully',
                'data': serializer.data
            }, status=201)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


    def patch(self, request):
        try:
            user=request.data['user']
            group=request.data['id']
            if Chat.objects.filter(pk=group, users__in=[user]).exists():
                return Response({'status':402, 'message': 'Already a member!', 'data':[]}, status=402)
            
            with transaction.atomic():
                chat = Chat.objects.get(pk=group)
                chat.users.add(user)
                chat.save()
                chat = Chat.objects.get(pk=group)

            serializer = ChatSerializer(chat)
            return Response({
                'status':201,
                'data': serializer.data,
                'message': 'Joined!'
            }, status=201)

        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)
        

class RenameGroup(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def patch(delf, request):
        try:
            user = request.data.get('user')
            chat_id = request.data.get('chatId')
            new_name = request.data.get('name')
            try:
                chat = Chat.objects.get(pk=chat_id, admin=user)
            except Chat.DoesNotExist:
                return Response({'message': 'Only admins can change group name!', 'status':401}, status=401)
            chat.name = new_name
            chat.save()
            serializer = ChatSerializer(chat)
            return Response({'status':201,'data':serializer.data, 'message':'Changed successfully'}, status=201)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class AddInGroup(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def patch(delf, request):
        try:
            user = request.data.get('user')
            chat_id = request.data.get('chatId')
            user_to_add = request.data.get('userId')
            try:
                chat = Chat.objects.get(pk=chat_id, admin=user)
            except Chat.DoesNotExist:
                return Response({'message': 'Only admins can add members!', 'status':401}, status=401)
            if user_to_add == user or Chat.objects.filter(pk=chat_id, users__pk=user_to_add).exists():
                return Response({'message': 'User already in the group!', 'staus':400}, status=400)
            try:
                with transaction.atomic():
                    chat = Chat.objects.get(pk=chat_id)
                    chat.users.add(User.objects.get(pk=user_to_add))
                    chat.save()
            except User.DoesNotExist:
                return Response({'message': 'Invalid user ID provided!'}, status=400)
            serializer = ChatSerializer(chat)
            return Response({'status':201,'data':serializer.data, 'message':'User added successfully'}, status=201)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class GroupMembers(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def post(self, request):
        try:
            chat_id=request.data.get('chatId')
            user_id=request.data.get('user')
            chat = Chat.objects.get(pk=chat_id)
            serializer=ChatSerializer(chat)
            is_user_present = any(user["id"] == user_id for user in serializer.data['users'])
            if not is_user_present:
                return Response({'status': 401, 'message':'Unauthorized request! You are not a member of this group!'}, status=401)
            return Response({'data':serializer.data['users'], 'status': 200, 'message':'Success!'}, status=200)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class RemoveFromGroup(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def patch(self, request):
        try:
            user = request.data.get('user')
            chat_id = request.data.get('chatId')
            user_to_remove = request.data.get('userId')
            try:
                chat = Chat.objects.get(pk=chat_id, admin=user)
            except Chat.DoesNotExist:
                return Response({'message': 'Only admins can remove members!', 'status':401}, status=401)
            if user_to_remove == user:
                return Response({'message': 'You cannot remove yourself!', 'staus':400}, status=400)
            if not Chat.objects.filter(pk=chat_id, users__pk=user_to_remove).exists():
                return Response({'message': 'User is not a member of the group!', 'status':400}, status=400)
            try:
                with transaction.atomic():
                    chat = Chat.objects.get(pk=chat_id)
                    chat.users.remove(User.objects.get(pk=user_to_remove))
                    chat.save()
            except User.DoesNotExist:
                return Response({'message': 'Invalid user ID provided!'}, status=400)
            serializer = ChatSerializer(chat)
            return Response({'status':201,'data':serializer.data, 'message':'User removed successfully'}, status=201)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class ChangeGroupPicture(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def patch(self, request):
        try:
            user = request.data.get('user')
            chat_id = request.data.get('chatId')
            picture = request.data.get('picture')
            try:
                chat = Chat.objects.get(pk=chat_id, admin=user)
            except Chat.DoesNotExist:
                return Response({'message': 'Only admins can change profile picture!', 'status':401}, status=401)

            with transaction.atomic():
                chat.picture_path=picture
                chat.save()
            serializer = ChatSerializer(chat)
            return Response({'status':201,'data':serializer.data, 'message':'Profile picture changed successfully'}, status=201)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class SearchGroups(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def get(self, request):
        try:
            keyword = request.query_params.get('search', '')
            if keyword:
                chats = Chat.objects.filter(name__iregex=keyword)[:10]
            else:
                chats = Chat.objects.filter()[:10]
            serializer = ChatSerializer(chats, many=True)
            return Response({'data': serializer.data, 'status': 200}, status=200)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)


class SearchUsers(GenericAPIView):
    permission_classes = [IsAuthenticatedWithBearerToken]
    def get(self, request):
        try:
            keyword = request.query_params.get('search', '')
            calling_userId = request.query_params.get('user', '')
            if keyword:
                users = User.objects.filter(Q(name__iregex=keyword) | Q(username__iregex=keyword)).exclude(pk=calling_userId)[:10]
            else:
                users = User.objects.filter().exclude(pk=calling_userId)[:10]

            serializer = UserSerializer(users, many=True)
            return Response({'data': serializer.data, 'status': 200}, status=200)
        except Exception as e:
            print(e)
            return Response({'status': 500, 'message':'Internal Server Error'}, status=500)
