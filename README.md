# 💬 Real-Time Chat Application Backend

A production-ready, scalable WhatsApp-like chat system built with Node.js, Express, Socket.IO, and MongoDB. Features real-time messaging, message status tracking (sent/delivered/read), typing indicators, and online presence management.

![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5+-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-010101?style=flat&logo=socket.io&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)

---

## 📖 Description

A fully-functional real-time chat backend system that replicates core WhatsApp features. Built with modern technologies and best practices, this system handles authentication, real-time messaging, presence tracking, and media uploads. Designed for scalability and production deployment.

**Key Highlights:**
- Real-time bidirectional communication using WebSockets
- JWT-based authentication with access and refresh tokens
- Message status tracking (✓ sent, ✓✓ delivered, ✓✓ read)
- In-memory presence management for optimal performance
- RESTful API for all CRUD operations
- Production-ready error handling and validation

---

## 🚀 Features

### ✅ Implemented Features

#### Authentication & Security
- ✓ User registration with phone number and password
- ✓ Secure login with JWT access tokens (15min) and refresh tokens (7 days)
- ✓ Password hashing using bcrypt (10 rounds)
- ✓ JWT-based route protection middleware
- ✓ Rate limiting (100 requests per 15 minutes per IP)
- ✓ Input validation using Joi schemas

#### Real-Time Messaging
- ✓ 1-to-1 private chat
- ✓ Group chat with multiple members
- ✓ Real-time message delivery via Socket.IO
- ✓ Message status tracking: sent → delivered → read
- ✓ Typing indicators with auto-cleanup (5 seconds)
- ✓ Online/offline presence tracking
- ✓ Last seen timestamp

#### Message Management
- ✓ Send text messages
- ✓ Send media files (images, documents) via Cloudinary
- ✓ Message pagination (50 messages per page)
- ✓ Delete message for yourself
- ✓ Delete message for everyone (within 1 hour, sender only)
- ✓ Mark messages as delivered/read
- ✓ Track who read the message (readBy array)

#### User Features
- ✓ User profile with name, phone, avatar
- ✓ Search users by name or phone
- ✓ Get current user profile
- ✓ Online/offline status
- ✓ Last seen tracking

#### Chat Features
- ✓ Create or retrieve existing 1-to-1 chat
- ✓ Create group chat with admin role
- ✓ List all user chats (sorted by last message)
- ✓ Get chat details with members
- ✓ Auto-join socket rooms for real-time updates

#### Technical Features
- ✓ MongoDB with Mongoose ODM
- ✓ Indexed database queries for performance
- ✓ In-memory presence storage (Map-based)
- ✓ Automatic stale connection cleanup (every 5 minutes)
- ✓ CORS enabled for cross-origin requests
- ✓ Global error handling middleware
- ✓ Health check endpoint
- ✓ Environment-based configuration

---

## 🛠 Tech Stack

### Backend Framework
- **Node.js** (v16+) - JavaScript runtime
- **Express.js** (v4.18) - Web application framework
- **Socket.IO** (v4.7) - Real-time bidirectional communication

### Database
- **MongoDB** (v5+) - NoSQL database
- **Mongoose** (v7.6) - MongoDB object modeling

### Authentication & Security
- **jsonwebtoken** (v9.0) - JWT token generation/verification
- **bcryptjs** (v2.4) - Password hashing
- **express-rate-limit** (v7.1) - API rate limiting
- **Joi** (v17.11) - Request validation

### File Upload & Storage
- **Multer** (v1.4) - Multipart form data handling
- **Cloudinary** (v1.41) - Cloud media storage
- **Streamifier** (v0.1) - Stream conversion utility

### Development Tools
- **Nodemon** (v3.0) - Auto-restart on file changes
- **dotenv** (v16.3) - Environment variable management
- **CORS** (v2.8) - Cross-origin resource sharing

---

## 📂 Project Structure

```
whatsapp-chat-backend/
│
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection setup
│   │   └── cloudinary.js        # Cloudinary configuration
│   │
│   ├── controllers/
│   │   ├── authController.js    # Register, login handlers
│   │   ├── userController.js    # User profile, search handlers
│   │   ├── chatController.js    # Chat creation, retrieval handlers
│   │   └── messageController.js # Message CRUD, status handlers
│   │
│   ├── models/
│   │   ├── User.js              # User schema (name, phone, password, status)
│   │   ├── Chat.js              # Chat schema (members, group info)
│   │   └── Message.js           # Message schema (content, status, readBy)
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # POST /api/auth/register, /login
│   │   ├── userRoutes.js        # GET /api/user/me, /search
│   │   ├── chatRoutes.js        # POST /api/chat, GET /api/chat
│   │   └── messageRoutes.js     # POST /api/message, GET, DELETE
│   │
│   ├── services/
│   │   ├── authService.js       # Authentication business logic
│   │   ├── chatService.js       # Chat operations logic
│   │   ├── messageService.js    # Message operations logic
│   │   └── presenceService.js   # In-memory presence tracking
│   │
│   ├── sockets/
│   │   └── chatSocket.js        # Socket.IO event handlers
│   │
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── validate.js          # Joi validation middleware
│   │   └── upload.js            # Multer file upload config
│   │
│   ├── utils/
│   │   ├── jwt.js               # JWT helper functions
│   │   └── validators.js        # Joi validation schemas
│   │
│   └── app.js                   # Express app configuration
│
├── server.js                    # Server entry point
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── postman_collection.json      # Postman API collection
└── README.md                    # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **MongoDB** v5 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn** package manager

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/whatsapp-chat-backend.git
cd whatsapp-chat-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/whatsapp-chat
JWT_ACCESS_SECRET=your_strong_secret_key_here
JWT_REFRESH_SECRET=your_strong_refresh_key_here
```

### Step 4: Start MongoDB
**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Or start local MongoDB:**
```bash
mongod
```

### Step 5: Run Application
**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### Step 6: Verify Installation
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

✅ **Server is now running on** `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `5000` |
| `NODE_ENV` | Environment (development/production) | No | `development` |
| `MONGODB_URI` | MongoDB connection string | **Yes** | - |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | **Yes** | - |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | **Yes** | - |
| `JWT_ACCESS_EXPIRY` | Access token expiration time | No | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiration time | No | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (for media) | No | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit time window (ms) | No | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | `100` |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "1234567890",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Doe", "phone": "1234567890" },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "1234567890",
  "password": "password123"
}
```

---

### User Endpoints

#### 3. Get Current User
```http
GET /api/user/me
Authorization: Bearer {accessToken}
```

#### 4. Search Users
```http
GET /api/user/search?q=john
Authorization: Bearer {accessToken}
```

---

### Chat Endpoints

#### 5. Create/Get 1-to-1 Chat
```http
POST /api/chat
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "other_user_id",
  "isGroup": false
}
```

#### 6. Create Group Chat
```http
POST /api/chat
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "isGroup": true,
  "groupName": "My Group",
  "members": ["user_id_1", "user_id_2"]
}
```

#### 7. Get All Chats
```http
GET /api/chat
Authorization: Bearer {accessToken}
```

#### 8. Get Chat by ID
```http
GET /api/chat/:chatId
Authorization: Bearer {accessToken}
```

---

### Message Endpoints

#### 9. Send Text Message
```http
POST /api/message
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "chatId": "chat_id",
  "content": "Hello!",
  "type": "text"
}
```

#### 10. Send Media Message
```http
POST /api/message
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

chatId: chat_id
type: image
file: [binary file]
```

#### 11. Get Messages (Paginated)
```http
GET /api/message/:chatId?page=1&limit=50
Authorization: Bearer {accessToken}
```

#### 12. Delete Message
```http
DELETE /api/message/:messageId
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "deleteForEveryone": false
}
```

#### 13. Mark as Delivered
```http
POST /api/message/delivered
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "messageId": "message_id"
}
```

#### 14. Mark as Read
```http
POST /api/message/read
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "messageId": "message_id"
}
```

---

## 🔄 Real-Time Features (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_access_token' }
});
```

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `send_message` | `{ chatId, content, type }` | Send a new message |
| `message_delivered` | `{ messageId, chatId }` | Mark message as delivered |
| `message_read` | `{ messageId, chatId }` | Mark message as read |
| `typing` | `{ chatId }` | Start typing indicator |
| `stop_typing` | `{ chatId }` | Stop typing indicator |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `receive_message` | `{ message object }` | New message received |
| `message_delivered` | `{ messageId, chatId }` | Message delivered confirmation |
| `message_read` | `{ messageId, chatId, userId }` | Message read confirmation |
| `user_online` | `{ userId }` | User came online |
| `user_offline` | `{ userId }` | User went offline |
| `typing` | `{ chatId, userId }` | User is typing |
| `stop_typing` | `{ chatId, userId }` | User stopped typing |
| `error` | `{ message }` | Error occurred |

### Example Usage
```javascript
// Send message
socket.emit('send_message', {
  chatId: '507f1f77bcf86cd799439011',
  content: 'Hello!',
  type: 'text'
});

// Receive message
socket.on('receive_message', (message) => {
  console.log('New message:', message);
});

// Typing indicator
socket.emit('typing', { chatId: '507f1f77bcf86cd799439011' });
socket.on('typing', (data) => {
  console.log(`User ${data.userId} is typing...`);
});
```

---

## 🧪 Testing

### Using Postman

1. **Import Collection**
   - Import `postman_collection.json` into Postman
   - Collection includes all endpoints with examples

2. **Test Flow**
   ```
   1. Register User → Save accessToken
   2. Login → Verify token
   3. Get User Profile
   4. Search Users
   5. Create Chat
   6. Send Message
   7. Get Messages
   8. Test Message Status
   ```

3. **Variables Auto-Populate**
   - `accessToken` - After login
   - `userId` - After registration
   - `chatId` - After creating chat
   - `messageId` - After sending message

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","phone":"1111111111","password":"pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"1111111111","password":"pass123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/user/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Socket.IO Testing

Open `socket-client-example.html` in browser:
1. Enter JWT token from login
2. Click "Connect"
3. Test real-time features

---

## 🚀 Deployment

### Deploy to Railway

1. **Create Railway Account** at [railway.app](https://railway.app)

2. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

3. **Login and Deploy**
```bash
railway login
railway init
railway up
```

4. **Add Environment Variables**
```bash
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_ACCESS_SECRET="your_secret"
railway variables set JWT_REFRESH_SECRET="your_secret"
```

### Deploy to Render

1. **Create Render Account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables** in Render dashboard

### Deploy Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name chat-backend

# Monitor
pm2 monit

# View logs
pm2 logs chat-backend

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Production Checklist
- ✅ Set `NODE_ENV=production`
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Use MongoDB Atlas for database
- ✅ Enable HTTPS
- ✅ Configure CORS for specific domains
- ✅ Set up monitoring (PM2, New Relic)
- ✅ Enable database backups
- ✅ Use Cloudinary for media storage

---

## 📌 Future Improvements

### Planned Features
- [ ] End-to-end encryption for messages
- [ ] Voice message support
- [ ] Video call integration (WebRTC)
- [ ] Message reactions (emoji)
- [ ] Message forwarding
- [ ] Starred/favorite messages
- [ ] Chat backup and export
- [ ] Push notifications (FCM)
- [ ] Message search functionality
- [ ] User blocking feature

### Technical Enhancements
- [ ] Redis for distributed presence (multi-server)
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Microservices architecture
- [ ] GraphQL API option
- [ ] Comprehensive unit tests
- [ ] API documentation (Swagger)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Load balancing setup
- [ ] CDN integration for media

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) - Real-time engine
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Web framework
- [Cloudinary](https://cloudinary.com/) - Media management

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: your.email@example.com
- Documentation: See project wiki

---

**⭐ Star this repository if you find it helpful!**

**Built with ❤️ using Node.js, Express, Socket.IO, and MongoDB**
