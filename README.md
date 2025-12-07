# 📋 Task Tracker - Full Stack Application

A production-ready task management application featuring **Redux Toolkit state management**, **fully responsive design**, and **JWT authentication**.

## 🎯 Project Overview

Task Tracker is a full-stack web application that allows users to:
- Register and authenticate securely
- Create, read, update, and delete tasks
- Organize tasks by status and priority
- Track task progress in real-time
- View statistics and insights
- Manage application state with Redux
- Access seamlessly on mobile, tablet, and desktop

### Architecture

```
┌─────────────────────────┐         ┌────────────────────┐
│   Frontend (React)      │         │  Backend (Express) │
├─────────────────────────┤         ├────────────────────┤
│ Redux Store             │◄───────►│ REST API (8 routes)│
│  ├─ Auth Slice          │  HTTP   │ ├─ Auth endpoints  │
│  └─ Tasks Slice         │         │ └─ Task CRUD       │
├─────────────────────────┤         ├────────────────────┤
│ Responsive Components   │         │ JWT Authentication │
│ (Tailwind CSS)          │         │ Input Validation   │
└─────────────────────────┘         └────────────────────┘
           │                                  │
           └──────────────────────────────────┘
                    MongoDB Atlas
                (Tasks & User Data)
```

## 📁 Project Structure

```
Task Tracker/
├── 📚 Documentation/
│   ├── README.md                    # This file - Project overview
│   ├── DEPLOYMENT.md                # Complete deployment guide (450+ lines)
│   ├── QUICKSTART.md                # 5-minute quick start
│   └── CLEANUP-SUMMARY.md           # Project optimization report
│
├── 🖥️ Backend/
│   ├── README.md                    # API documentation
│   └── server/
│       ├── index.js                 # Main server (8 REST endpoints)
│       ├── package.json             # Dependencies
│       ├── .env                     # Environment variables (not in git)
│       ├── .env.example             # Environment template
│       ├── models/
│       │   ├── User.js              # User schema with validation
│       │   └── Task.js              # Task schema with indexes
│       └── middleware/
│           └── auth.js              # JWT authentication middleware
│
└── 💻 Frontend/
    └── client/
        ├── README.md                # Frontend documentation
        ├── package.json             # Dependencies (Redux 2.11.0 ✨)
        ├── .env.local               # Environment variables (not in git)
        ├── .env.example             # Environment template
        ├── next.config.mjs          # Next.js 16 configuration
        ├── postcss.config.mjs       # Tailwind CSS 4 config
        └── src/
            ├── redux/               # ⭐ Redux Toolkit State Management
            │   ├── store.js         # Store configuration
            │   └── slices/
            │       ├── authSlice.js # Auth state & async thunks
            │       └── tasksSlice.js# Tasks state & async thunks
            ├── app/
            │   ├── layout.js        # Root layout with Redux Provider
            │   ├── client-layout.js # Client-side layout wrapper
            │   ├── page.js          # Login/Register page
            │   ├── globals.css      # Global styles
            │   └── dashboard/
            │       └── page.js      # Main dashboard with task management
            ├── components/
            │   └── shared.jsx       # Reusable UI components
            ├── context/
            │   └── AuthContext.js   # Authentication context
            └── utils/
                ├── api.js           # Axios configuration with interceptors
                └── helpers.js       # Utility functions
```

### Prerequisites
- Node.js v20+ and npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free tier)

### Step 1: Setup Backend

```bash
cd Backend/server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start  # Runs on http://localhost:5000

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env file
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tasktracker
# JWT_SECRET=your-super-secret-key-change-this
# NODE_ENV=development
# PORT=5000

# Start backend server
npm start

# Server runs on http://localhost:5000
```

### Step 2: Setup Frontend (with Redux)

```bash
cd Frontend/client

# Install dependencies (includes Redux packages)
npm install

# Configure environment
cp .env.example .env.local

# Edit .env.local (optional - uses localhost:5000 by default)
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev

# Application will be available at http://localhost:3000
```

### Step 3: Open Application

Visit `http://localhost:3000` in your browser and:
1. **Register** a new account (or use demo: demo@example.com / password123)
2. **Login** with your credentials
3. **Create** and manage your tasks
4. **Track** progress with the dashboard

## ✨ Key Features

### State Management (Redux)
- ✅ Centralized Redux store with @reduxjs/toolkit
- ✅ Auth slice for user authentication (login, register, logout)
- ✅ Tasks slice for CRUD operations with async thunks
- ✅ Filtering and sorting with memoized selectors
- ✅ Error and success message handling
- ✅ Automatic localStorage token persistence
- ✅ Time-travel debugging ready (Redux DevTools compatible)

### Authentication & Security
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Protected API routes with middleware
- ✅ Auto-logout on 401 responses
- ✅ Token validation on app startup

### Task Management
- ✅ Create tasks with title, description, priority, due date
- ✅ Update task status (todo → in-progress → done)
- ✅ Delete tasks with confirmation
- ✅ Search tasks by title/description
- ✅ Filter by status (all, todo, in-progress, done)
- ✅ Sort by priority, due date, title, or date created
- ✅ Task statistics dashboard (total, by status, high priority count)

### Responsive Design
- ✅ Mobile-first approach (works on 375px+ devices)
- ✅ Tablet optimization (640px breakpoint)
- ✅ Desktop layout (768px+ breakpoints)
- ✅ Hamburger menu on mobile
- ✅ Responsive typography (text-xs → sm:text-sm)
- ✅ Touch-friendly buttons and inputs
- ✅ Adaptive grid layouts (1 col → 2 → 5 cols)

### Modern Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **State Management**: Redux with @reduxjs/toolkit
- **HTTP Client**: Axios with JWT interceptors
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs password hashing

## 📖 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/validate          # Validate JWT token
```

### Tasks (Protected Routes)
```
GET    /api/tasks                  # Get all user tasks
GET    /api/tasks/:id              # Get single task
POST   /api/tasks                  # Create new task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
GET    /api/tasks/stats/summary    # Get task statistics
```

### Health Check
```
GET    /api/health                 # Server health status
```

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication with expiration
2. **Password Hashing**: bcryptjs with 10 salt rounds (industry standard)
3. **CORS**: Properly configured for cross-origin requests
4. **Input Validation**: Email format, password length, field requirements
5. **Authorization**: Users can only access their own data
6. **Error Handling**: Secure error messages without exposing internals
7. **HTTPS Ready**: Designed for production with SSL/TLS support
8. **Token Persistence**: Secure localStorage with automatic token refresh

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase, validated),
  password: String (hashed with bcryptjs),
  createdAt: Date (timestamp),
  lastLogin: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to User),
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  priority: String (enum: low, medium, high),
  status: String (enum: todo, in-progress, done),
  dueDate: Date (optional),
  completedAt: Date (set when status = done),
  tags: [String] (optional),
  subtasks: [{                 # Support for subtasks
    title: String,
    completed: Boolean,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Database Indexes
- Users: email (unique), createdAt
- Tasks: user_id + status (composite), user_id + createdAt (for sorting)

## 🧪 Testing Guide

### Frontend Redux Testing
```javascript
// In browser console, open Redux DevTools
// You'll see real-time state changes for:
// - Auth: login, register, logout, token validation
// - Tasks: create, update, delete, fetch, filter, sort
// - UI: search, filter status, sort criteria
```

### Backend Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login (returns JWT token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all tasks (replace TOKEN with JWT)
curl -X GET http://localhost:5000/api/tasks \
  -H "x-auth-token: TOKEN"

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "x-auth-token: TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high","status":"todo"}'
```

## 🌐 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/tasktracker
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📦 Installation & Dependencies

### Backend Dependencies
- **express** (v5.2.1) - Web server framework
- **mongoose** (v9.0.1) - MongoDB ORM
- **bcryptjs** (v3.0.3) - Password hashing
- **jsonwebtoken** (v9.0.3) - JWT authentication
- **cors** (v2.8.5) - Cross-origin requests
- **dotenv** (v17.2.3) - Environment variables

### Frontend Dependencies
- **next** (v16.0.7) - React framework
- **react** (v19.2.0) - UI library
- **react-dom** (v19.2.0) - DOM rendering
- **axios** (v1.13.2) - HTTP client
- **tailwindcss** (v4) - CSS framework

## 🚀 Deployment

### Deploy Backend
Recommended platforms: Heroku, Railway, Render, AWS
- Set environment variables on hosting platform
- Use MongoDB Atlas for cloud database
- Update `MONGO_URI` and `JWT_SECRET`

### Deploy Frontend
Recommended: Vercel (optimal for Next.js)
- Connect GitHub repository
- Add environment variables
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- One-click deployment

### Example: Vercel + Railway
1. Push code to GitHub
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Update `NEXT_PUBLIC_API_URL` in Vercel environment variables

## 🐛 Troubleshooting

### Backend Won't Start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use: `lsof -i :5000`
- Review error logs in console

### Frontend Won't Connect to Backend
- Ensure backend is running on `http://localhost:5000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Clear browser cache and localhost storage
- Check browser Network tab for API errors

### Database Issues
- Verify MongoDB connection string
- Check database user credentials
- Ensure MongoDB service is running
- Try connecting with MongoDB Compass

### Authentication Problems
- Clear localStorage: `localStorage.clear()`
- Check JWT token expiration
- Verify password is at least 6 characters
- Check email format validation

## 📚 Documentation

- **[Backend README](Backend/README.md)** - Detailed backend documentation
- **[Frontend README](Frontend/client/README.md)** - Detailed frontend documentation

## 💡 Code Quality

### Best Practices Implemented
- ✅ Clean, modular code structure
- ✅ Proper error handling throughout
- ✅ Input validation on both frontend and backend
- ✅ Environment-based configuration
- ✅ Responsive design
- ✅ Performance optimizations
- ✅ Security best practices

### Code Standards
- Clear, meaningful variable names
- Proper comments for complex logic
- Consistent formatting
- Reusable components and functions
- DRY principle followed

## 🔄 Workflow

### Creating a Task
1. User fills in task form (title required)
2. Frontend validates input
3. Sends POST request to `/api/tasks`
4. Backend validates and creates task
5. Returns task object with ID
6. Frontend updates task list
7. User sees new task immediately

### Updating Task Status
1. User selects new status from dropdown
2. Frontend sends PUT request to `/api/tasks/:id`
3. Backend updates task status
4. Frontend refreshes task list
5. Statistics update in real-time

### Authentication Flow
1. User enters credentials
2. Frontend validates format
3. Sends POST to `/api/auth/login`
4. Backend verifies credentials
5. Returns JWT token
6. Frontend stores token in localStorage
7. Token included in all future requests
8. Backend validates token on each request

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- RESTful API design
- Authentication & authorization
- Database design with MongoDB
- React component architecture
- State management with Context API
- Responsive web design
- Error handling and validation
- Modern development practices

## 📝 Notes for Interviewers

### Code Quality
- Clean, well-structured code
- Proper separation of concerns
- Reusable components and utilities
- Comprehensive error handling
- Input validation throughout

### Features Implemented
- ✅ User authentication with JWT
- ✅ Full CRUD operations for tasks
- ✅ Task filtering and sorting
- ✅ Real-time statistics
- ✅ Responsive design
- ✅ Error handling and user feedback
- ✅ Protected API routes
- ✅ Database indexing

### UI/UX Enhancements
- Modern, clean design
- Intuitive navigation
- Visual feedback for all actions
- Loading and error states
- Empty state messages
- Priority and status indicators
- Search functionality

## 🤝 Contributing

This is an internship assignment. Feel free to:
- Suggest improvements
- Report bugs
- Optimize code
- Add new features
- Improve documentation

## 📞 Support

If you encounter issues:
1. Check the detailed README files
2. Review error messages in console/logs
3. Verify all prerequisites are installed
4. Check environment variables
5. Review troubleshooting sections

## 📄 License

This project is created as part of the Brew Software Developer Internship Assignment.

---
