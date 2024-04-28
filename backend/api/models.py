from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError


class Chat(models.Model):
    name = models.CharField(
        _("Group Name"),
        max_length=150,
    )
    users = models.ManyToManyField(
        "api.User",
        blank=True,
        related_name="chat_users",
    )
    admin = models.ForeignKey(
        "api.User",
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="chat_admin",
    )
    picture_path = models.TextField(
        _("Picture Path"),
        default="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.name = self.name.strip().title()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        db_table = "chat"
        ordering = []
        verbose_name = "Chat"
        verbose_name_plural = "Chats"


class User(models.Model):
    name = models.CharField(
        _("Name"),
        max_length=50,
    )
    username = models.CharField(
        _("Email"),
        max_length=255,
    )
    password = models.CharField(
        _("Password"),
        max_length=255,
    )
    picture = models.TextField(
        _("Picture Path"),
        default="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.name = self.name.strip().title()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        db_table = "user"
        ordering = []
        verbose_name = "User"
        verbose_name_plural = "Users"


class Message(models.Model):
    chatId = models.ForeignKey(
        "api.Chat",
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="message_chat",
    )
    sender = models.ForeignKey(
        "api.User",
        blank=False,
        null=True,
        on_delete=models.SET_NULL,
        related_name="message_sender",
    )
    text = models.TextField(
        _("Message text"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "message"
        ordering = []
        verbose_name = "Message"
        verbose_name_plural = "Messages"
