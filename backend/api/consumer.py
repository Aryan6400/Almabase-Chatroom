from channels.generic.websocket import AsyncWebsocketConsumer
import json

class PersonalChatConsumer(AsyncWebsocketConsumer) :
    async def connect(self):
        self.room_group_name=f"{self.scope['url_route']['kwargs']['id']}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print("Connected to", self.room_group_name)

    async def chat_message(self, event):
        message=event['message']
        await self.send(text_data=json.dumps({"message":message}))

    async def receive(self, text_data=None, bytes_data=None):
        data=json.loads(text_data)
        message=data['message']
        print(message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message
            }
        )

    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )