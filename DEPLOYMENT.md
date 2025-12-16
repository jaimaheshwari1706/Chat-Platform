# Deployment Guide - Connectly Chat Platform

## Quick Deploy (Recommended)

### 1. Backend Deployment (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd Chat-Platform-Backend
railway deploy
```

### 2. Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd Chat-Platform
ng build --configuration=production
vercel --prod
```

## Alternative Deployment Options

### Option 1: Netlify + Railway
- **Backend**: Railway (same as above)
- **Frontend**: Netlify
```bash
cd Chat-Platform
ng build --configuration=production
# Upload dist/chat-frontend to Netlify
```

### Option 2: Heroku (Both)
```bash
# Backend
cd Chat-Platform-Backend
heroku create your-chat-backend
git push heroku main

# Frontend
cd Chat-Platform
ng build --configuration=production
# Deploy to Heroku static
```

### Option 3: DigitalOcean App Platform
- Connect GitHub repository
- Auto-deploy on push

## Environment Variables Setup

### Backend (.env.production)
```
PORT=8080
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api',
  wsUrl: 'https://your-backend-domain.com/ws'
};
```

## Post-Deployment Steps

1. **Update CORS Origin**: Set your frontend domain in backend environment
2. **Update API URLs**: Set your backend domain in frontend environment
3. **Test WebSocket**: Ensure WebSocket connections work across domains
4. **SSL Certificate**: Both domains should use HTTPS

## Testing Live Deployment

1. Open your deployed frontend URL
2. Register two different users
3. Open in two different browsers/devices
4. Test real-time messaging

## Troubleshooting

### WebSocket Issues
- Ensure backend supports WebSocket upgrades
- Check CORS configuration
- Verify SSL certificates

### File Upload Issues
- Check file size limits on hosting platform
- Verify upload directory permissions
- Test file serving from backend

## Free Hosting Recommendations

1. **Railway** (Backend) - Free tier with good WebSocket support
2. **Vercel** (Frontend) - Excellent Angular support
3. **Netlify** (Frontend Alternative) - Good static hosting
4. **Render** (Backend Alternative) - Free tier available

## Custom Domain Setup

1. **Purchase domain** from any registrar
2. **Configure DNS** to point to your hosting platforms
3. **Update environment variables** with new domains
4. **Test HTTPS** and WebSocket connections