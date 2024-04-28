import socketio
from aiohttp import web

sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

@sio.event
async def connect(sid, environ):
    print('Connected', sid)

@sio.event
async def join_chat(sid, room):
    await sio.enter_room(sid, room)

@sio.event
async def new_message(sid, data):
    chat_id = data['chatId']['id']
    await sio.emit('message_received', data, room=chat_id)

if __name__ == '__main__':
    web.run_app(app)
