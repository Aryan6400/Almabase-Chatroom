from django.urls import path

from .views import *

urlpatterns = [
    path("/login", Login.as_view(), name="Login"),
    path("/register", Register.as_view(), name="Register"),
    path("/chats/<int:chat_id>", Messages.as_view(), name="Message"),
    path("/group", Groups.as_view(), name="Create Group"),
    path("/group/search",SearchGroups.as_view(), name="Search groups"),
    path("/user/search",SearchUsers.as_view(), name="Search users"),
    path("/group/rename",RenameGroup.as_view(), name="Rename groups"),
    path("/group/add",AddInGroup.as_view(), name="Add members"),
    path("/group/remove",RemoveFromGroup.as_view(), name="Remove members"),
    path("/group/profile",ChangeGroupPicture.as_view(), name="Change profile picture"),
    path("/group/users",GroupMembers.as_view(), name="Get group members"),
]