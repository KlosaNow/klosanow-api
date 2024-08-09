# Documentation

This is the documentation of all the API endpoints and socket events of the Klosanow Backend Server.

## Web Socket

This part of the documentation provides all the events that the web socket server emits, and the data required for each event.

### Authentication

The web socket server uses a middleware to check for a JWT token in `socket.handshake.query.token`. A user object is deserialized from the token after validation and this user object is passed to the socket events as `socket.user`.  

All socket event require an authenticated user.  

### Chat Web Socket

All chat events are prefixed with `chats:`.

#### Get All Chats

Returns all the chats of the `socket.user`.

- event: `get-all`
- data: `{ }`

#### Get A Chat

Returns a chat of the `socket.user`.

- event: `get-one`
- data: `{ chatId }`

#### Delete A Chat

Delete a chat of the `socket.user`.

- event: `delete-one`
- data: `{ chatId }`

#### Send Chat Message

Send a chat message as `socket.user`.

- event: `send-message`
- data: `{ recipientId, message }`

### Study Chat Web Socket

All study chat events are prefixed with `studychats:`.

#### Get All Study Chats

Returns all the study chats of the `socket.user`.

- event: `get-all`
- data: `{ }`

#### Get A Study Chat

Returns a study chat of the `socket.user`.

- event: `get-one`
- data: `{ studyChatId }`

#### Create A Study Chat

Creates a new study chat with `socket.user` as the owner.

- event: `create`
- data: `{ title, photoUrl, members }`

#### Delete A Study Chat

Delete a study chat of the `socket.user`.

- event: `delete-one`
- data: `{ sstudyChatId }`

#### Add Study Chat Member

Add a new member to a study chat of the `socket.user`.

- event: `add-member`
- data: `{ studyChatId, members }`

#### Update Study Chat Photo

Update photo of study chat of the `socket.user`.

- event: `update-photo`
- data: `{ studyChatId, photoUrl }`

#### Send Study Chat Message

Send a study chat message as `socket.user`.

- event: `send-message`
- data: `{ studyChatId, message }`

## HTTPS API

For the HTTPS API documentation, refer to the Postman documentation [here](https://documenter.getpostman.com/view/20210194/2s9YeD9Z4d).
