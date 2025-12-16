export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api',
  wsUrl: 'https://your-backend-domain.com/ws',
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  features: {
    fileSharing: true,
    reactions: true,
    typingIndicators: true,
    onlineStatus: true,
    emojiPicker: true
  }
};