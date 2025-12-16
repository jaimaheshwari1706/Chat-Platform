# Connectly - Advanced Real-Time Chat Platform

A modern, feature-rich chat application built with Angular 21 and Node.js, designed to provide the best-in-class messaging experience.

## 🚀 Features

### Core Messaging
- **Real-time messaging** with WebSocket (SockJS/STOMP)
- **Message history** with persistent storage
- **Typing indicators** to show when users are typing
- **Online status** tracking for all users
- **Message timestamps** with formatted display

### Advanced Features
- **File sharing** with drag-and-drop support (up to 10MB)
- **Message reactions** with emoji support
- **Emoji picker** for enhanced expression
- **Auto-scroll** to latest messages
- **Responsive design** optimized for all devices

### User Experience
- **Modern UI** with Tailwind CSS and gradient designs
- **Dark theme** for comfortable viewing
- **Smooth animations** and transitions
- **Real-time notifications** for new messages
- **User avatars** with online status indicators

### Security & Authentication
- **JWT-based authentication** with secure token handling
- **Password hashing** with bcrypt
- **Protected routes** and API endpoints
- **File upload validation** and security

## 🛠️ Technology Stack

### Frontend
- **Angular 21** - Latest Angular framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming
- **STOMP.js** - WebSocket messaging protocol
- **SockJS** - WebSocket fallback support

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SockJS** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **bcrypt** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v21 or higher)

### Frontend Setup
```bash
cd Chat-Platform
npm install
ng serve
```
The frontend will be available at `http://localhost:4200`

### Backend Setup
```bash
cd Chat-Platform-Backend
npm install
npm start
```
The backend will be available at `http://localhost:8080`

## 🎯 Usage

1. **Registration/Login**: Create an account or login with existing credentials
2. **Start Chatting**: Send messages in real-time to other users
3. **Share Files**: Drag and drop files or use the attachment button
4. **React to Messages**: Hover over messages to add emoji reactions
5. **Express Yourself**: Use the emoji picker to add emotions to your messages

## 🔧 Configuration

### Environment Variables (Backend)
```bash
PORT=8080                    # Server port
JWT_SECRET=your-secret-key   # JWT signing secret
```

### API Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/messages` - Retrieve message history
- `POST /api/upload` - File upload
- `GET /api/online-users` - Get online users list

### WebSocket Events
- `/app/chat` - Send messages
- `/app/typing/start` - Start typing indicator
- `/app/typing/stop` - Stop typing indicator
- `/app/reaction` - Send message reactions
- `/topic/messages` - Receive messages
- `/topic/typing` - Receive typing indicators
- `/topic/online` - Receive online users updates
- `/topic/reactions` - Receive message reactions

## 🎨 UI/UX Features

### Design Elements
- **Gradient backgrounds** for modern aesthetics
- **Glassmorphism effects** for depth and elegance
- **Smooth hover animations** for interactive elements
- **Responsive grid layouts** for optimal viewing
- **Custom scrollbars** for consistent styling

### Accessibility
- **Keyboard navigation** support
- **Screen reader** compatible
- **High contrast** color schemes
- **Focus indicators** for interactive elements

## 🔒 Security Features

- **Input validation** and sanitization
- **File type restrictions** for uploads
- **Rate limiting** for API endpoints
- **CORS protection** for cross-origin requests
- **Secure token storage** in localStorage

## 📱 Mobile Responsiveness

- **Touch-friendly** interface design
- **Optimized layouts** for mobile screens
- **Gesture support** for file uploads
- **Mobile-first** CSS approach

## 🚀 Performance Optimizations

- **Lazy loading** for components
- **Message pagination** for large chat histories
- **Debounced typing** indicators
- **Optimized bundle** sizes
- **Efficient WebSocket** connection management

## 🔄 Real-time Features

- **Instant message delivery** with WebSocket
- **Live typing indicators** with user names
- **Real-time online status** updates
- **Immediate reaction** updates
- **Auto-reconnection** on connection loss

## 📊 Monitoring & Logging

- **Console logging** for debugging
- **Error handling** with user feedback
- **Connection status** monitoring
- **File upload progress** tracking

## 🛡️ Production Considerations

### Database Integration
Replace in-memory storage with:
- **MongoDB** for document-based storage
- **PostgreSQL** for relational data
- **Redis** for session management

### Scalability
- **Load balancing** for multiple server instances
- **Message queuing** with Redis/RabbitMQ
- **CDN integration** for file storage
- **Horizontal scaling** with Docker/Kubernetes

### Security Enhancements
- **Rate limiting** with Redis
- **Input sanitization** libraries
- **File scanning** for malware
- **HTTPS enforcement** in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Tailwind CSS for the utility-first approach
- STOMP.js community for WebSocket support
- All contributors and users of this project

---

**Built with ❤️ for the best chat experience possible**