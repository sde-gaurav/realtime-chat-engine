# WhatsApp-Like Real-Time Chat System

A production-ready, scalable real-time chat backend built with Node.js, Express, Socket.IO, MongoDB, and Redis.

## Features

- **Real-time messaging** using WebSockets (Socket.IO)
- **1-to-1 and group chat** support
- **Message status tracking**: sent (✓), delivered (✓✓), read (blue ✓✓)
- **Typing indicators**
- **Online/Offline presence** with in-memory storage
- **Last seen** tracking
- **Message deletion**: delete for me / delete for everyone
- **Media support**: images and files via Cloudinary
- **Message pagination**
- **JWT authentication** with access and refresh tokens
- **Rate limiting** for API protection
- **Input validation** using Joi
- **Production-ready error handling**

## Tech Stack

- **Node.js** + **Express** - Backend framework
- **MongoDB** + **Mongoose** - Database
- **Socket.IO** - Real-time WebSocket communication
- **In-Memory Storage** - Presence tracking and caching
- **JWT** - Authentication
- **Cloudinary** - Media storage (optional)
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis client setup
│   │   └── cloudinary.js        # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js    # Auth endpoints
│   │   ├── userController.js    # User endpoints
│   │   ├── chatController.js    # Chat endpoints
│   │   └── messageController.js # Message endpoints
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Chat.js              # Chat schema
│   │   └── Message.js           # Message schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   ├── userRoutes.js        # User routes
│   │   ├── chatRoutes.js        # Chat routes
│   │   └── messageRoutes.js     # Message routes
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── chatService.js       # Chat business logic
│   │   ├── messageService.js    # Message business logic
│   │   └── presenceService.js   # Presence tracking
│   ├── sockets/
│   │   └── chatSocket.js        # Socket.IO handlers
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── validate.js          # Validation middleware
│   │   └── upload.js            # File upload config
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── validators.js        # Joi schemas
│   └── app.js                   # Express app setup
├── server.js                    # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (v5+)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd whatsapp-chat-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-chat
JWT_ACCESS_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
mongod
```

5. **Start Redis**
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Or use local Redis installation
redis-server
```

6. **Run the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "1234567890",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "1234567890",
  "password": "password123"
}
```

### User

#### Get Current User
```http
GET /api/user/me
Authorization: Bearer <access_token>
```

#### Search Users
```http
GET /api/user/search?q=john
Authorization: Bearer <access_token>
```

### Chat

#### Create or Get Chat
```http
POST /api/chat
Authorization: Bearer <access_token>
Content-Type: application/json

# For 1-to-1 chat
{
  "userId": "user_id_here",
  "isGroup": false
}

# For group chat
{
  "isGroup": true,
  "groupName": "My Group",
  "members": ["user_id_1", "user_id_2"]
}
```

#### Get All Chats
```http
GET /api/chat
Authorization: Bearer <access_token>
```

#### Get Chat by ID
```http
GET /api/chat/:chatId
Authorization: Bearer <access_token>
```

### Message

#### Send Message
```http
POST /api/message
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "chatId": "chat_id_here",
  "content": "Hello!",
  "type": "text"
}
```

#### Send Media Message
```http
POST /api/message
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

chatId: chat_id_here
type: image
file: <file>
```

#### Get Messages (Paginated)
```http
GET /api/message/:chatId?page=1&limit=50
Authorization: Bearer <access_token>
```

#### Delete Message
```http
DELETE /api/message/:messageId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "deleteForEveryone": false
}
```

#### Mark as Delivered
```http
POST /api/message/delivered
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "messageId": "message_id_here"
}
```

#### Mark as Read
```http
POST /api/message/read
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "messageId": "message_id_here"
}
```

## Socket.IO Events

### Client → Server

#### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

#### Send Message
```javascript
socket.emit('send_message', {
  chatId: 'chat_id',
  content: 'Hello!',
  type: 'text'
});
```

#### Mark Delivered
```javascript
socket.emit('message_delivered', {
  messageId: 'message_id',
  chatId: 'chat_id'
});
```

#### Mark Read
```javascript
socket.emit('message_read', {
  messageId: 'message_id',
  chatId: 'chat_id'
});
```

#### Typing
```javascript
socket.emit('typing', { chatId: 'chat_id' });
```

#### Stop Typing
```javascript
socket.emit('stop_typing', { chatId: 'chat_id' });
```

### Server → Client

#### Receive Message
```javascript
socket.on('receive_message', (message) => {
  console.log('New message:', message);
});
```

#### Message Delivered
```javascript
socket.on('message_delivered', (data) => {
  console.log('Message delivered:', data);
});
```

#### Message Read
```javascript
socket.on('message_read', (data) => {
  console.log('Message read:', data);
});
```

#### User Online
```javascript
socket.on('user_online', (data) => {
  console.log('User online:', data.userId);
});
```

#### User Offline
```javascript
socket.on('user_offline', (data) => {
  console.log('User offline:', data.userId);
});
```

#### Typing
```javascript
socket.on('typing', (data) => {
  console.log('User typing:', data.userId);
});
```

#### Stop Typing
```javascript
socket.on('stop_typing', (data) => {
  console.log('User stopped typing:', data.userId);
});
```

## Message Status Flow

1. **Sent (✓)**: Message saved to database
2. **Delivered (✓✓)**: Recipient is online and received the message
3. **Read (blue ✓✓)**: Recipient opened the chat and viewed the message

## Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing using bcrypt
- Rate limiting to prevent abuse
- Input validation using Joi
- Protected routes with authentication middleware
- Secure file upload with type and size validation

## Testing with Postman

Import the Postman collection (see `postman_collection.json`) to test all endpoints.

### Quick Test Flow

1. Register two users
2. Login with both users (save tokens)
3. Search for users
4. Create a chat between users
5. Send messages via REST API or Socket.IO
6. Test message status updates
7. Test typing indicators
8. Test online/offline presence

## Production Deployment

### Environment Variables

Ensure all production secrets are set:
- Strong JWT secrets
- Production MongoDB URI
- Redis credentials
- Cloudinary credentials (if using media)

### Recommendations

- Use PM2 for process management
- Set up MongoDB replica set for high availability
- Use Redis Cluster for scalability
- Implement proper logging (Winston, Morgan)
- Set up monitoring (Prometheus, Grafana)
- Use HTTPS in production
- Implement proper CORS policies
- Set up CDN for media files
- Enable MongoDB indexes for performance
- Implement message queue for notifications

## License

MIT
