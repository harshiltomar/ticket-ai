# AI Assistant Backend

A Node.js/Express backend with AI-powered ticket management system using Inngest for background processing.

## Features

- **User Authentication**: JWT-based auth with role-based access (user, moderator, admin)
- **Ticket Management**: Create, view, and manage support tickets
- **AI Integration**: Automatic ticket analysis using Gemini AI
- **Background Processing**: Inngest for async task processing
- **Email Notifications**: Automated email alerts for ticket assignments
- **Role-based Access**: Different permissions for users, moderators, and admins

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
# Database
MONGO_URI=mongodb://localhost:27017/ai-assistant

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Server
PORT=3000
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/update-user` - Update user (admin only)
- `GET /api/auth/users` - Get all users (admin only)

### Tickets
- `GET /api/tickets` - Get all tickets (filtered by role)
- `GET /api/tickets/:id` - Get specific ticket
- `POST /api/tickets` - Create new ticket

### Inngest
- `POST /api/inngest` - Inngest webhook endpoint

## Architecture

- **Models**: User and Ticket schemas with MongoDB
- **Controllers**: Business logic for auth and ticket operations
- **Routes**: API endpoint definitions
- **Middleware**: JWT authentication
- **Inngest Functions**: Background processing for ticket creation and user signup
- **Utils**: AI analysis and email utilities

## Background Processing

The system uses Inngest for background tasks:
- **User Signup**: Sends welcome email on registration
- **Ticket Creation**: Analyzes ticket with AI, assigns priority, and notifies moderators

## AI Integration

Tickets are automatically analyzed using Gemini AI to:
- Determine priority (low/medium/high)
- Generate helpful notes for moderators
- Identify required technical skills
- Suggest appropriate moderators based on skills 