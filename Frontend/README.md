# 💻 Task Tracker - Frontend Client

A modern Next.js application with **Redux Toolkit state management**, responsive design, and seamless authentication.

**Status**: ✅ Production Ready | **Port**: 3000 | **Framework**: Next.js 16

> 📖 **Need deployment help?** See [../../DEPLOYMENT.md](../../DEPLOYMENT.md) for complete deployment guides.

## 🎯 Features

✅ **Authentication**
- User registration with real-time validation
- Secure login with JWT
- Token management via Redux
- Auto-redirect for protected routes
- Persistent login state
- Logout functionality

✅ **Task Management**
- Create tasks with title, description, due date, priority
- Update task status (Todo → In Progress → Done)
- Edit task details inline
- Delete tasks with confirmation
- Real-time task updates via Redux
- Task statistics and summaries

✅ **User Experience**
- Fully responsive design (mobile, tablet, desktop)
- Task filtering by status
- Search functionality
- Task sorting (date, priority, status)
- Loading states and spinners
- Error handling with alerts
- Toast notifications
- Clean, modern UI with Tailwind CSS 4

✅ **Modern Stack**
- **Next.js 16** with App Router + Turbopack
- **React 19** with latest features
- **Redux Toolkit 2.11.0** for state management ⭐
- **Tailwind CSS 4** for styling
- **Axios** for API communication
- **React Redux 9.2.0** for React bindings

## 📋 Prerequisites

- Node.js v20+ (recommended)
- npm or yarn
- Backend server running (see [../../Backend/README.md](../../Backend/README.md))

## 🚀 Installation & Setup

### 1. Navigate to frontend directory
```bash
cd Frontend/client
```

### 2. Install dependencies
```bash
npm install
```

**Dependencies installed**:
- `next` 16.0.7 - React framework with Turbopack
- `react` 19.2.0 - UI library
- `react-dom` 19.2.0 - React DOM renderer
- `@reduxjs/toolkit` 2.11.0 - Redux state management ⭐
- `react-redux` 9.2.0 - React-Redux bindings ⭐
- `redux` 5.0.1 - Core Redux library ⭐
- `redux-thunk` 3.1.0 - Async action support ⭐
- `axios` 1.13.2 - HTTP client
- `tailwindcss` 4.x - Utility-first CSS

### 3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

> 💡 **Note**: `NEXT_PUBLIC_` prefix makes the variable available in the browser.

### 4. Start the development server
```bash
npm run dev
```

✅ App runs on: **http://localhost:3000**

You should see:
```
▲ Next.js 16.0.7 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 1.2s
```

### 5. Build for production
```bash
npm run build
npm start
```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Project Structure

```
Frontend/client/src/
├── app/
│   ├── layout.js              # Root layout with AuthProvider
│   ├── page.js                # Login/Register page
│   ├── globals.css            # Global styles
│   └── dashboard/
│       └── page.js            # Main task dashboard
├── components/
│   └── shared.jsx             # Reusable UI components
├── context/
│   └── AuthContext.js         # Authentication state management
└── utils/
    ├── api.js                 # Axios instance with interceptors
    └── helpers.js             # Utility functions
```

## Quick Start

1. **Start Backend**: `cd Backend/server && npm start`
2. **Start Frontend**: `cd Frontend/client && npm run dev`
3. **Open**: http://localhost:3000

## License

This project is part of the Brew Software Developer Internship Assignment.
