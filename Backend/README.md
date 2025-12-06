# Task Tracker - Backend Server

A robust Node.js/Express REST API for managing tasks with user authentication and database persistence.

## Features

✅ **User Authentication**
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Token expiration (7 days)

✅ **Task Management**
- Create, Read, Update, Delete (CRUD) operations
- Task filtering and sorting
- Priority levels (low, medium, high)
- Task statuses (todo, in-progress, done)
- Due date tracking
- Task statistics/summaries

✅ **Security**
- JWT authentication middleware
- Input validation and sanitization
- CORS support
- Error handling

✅ **Database**
- MongoDB with Mongoose ODM
- User-specific task isolation
- Database indexing for performance

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone and navigate to backend**
   ```bash
   cd Backend/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/tasktracker
   JWT_SECRET=your-secret-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token", "msg": "Registration successful" }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token", "msg": "Login successful" }
```

### Task Routes (All require `x-auth-token` header)

#### Get All Tasks
```
GET /api/tasks
Headers: { "x-auth-token": "your_jwt_token" }

Response: {
  "success": true,
  "tasks": [
    {
      "_id": "task_id",
      "title": "Task title",
      "description": "Task description",
      "priority": "high|medium|low",
      "status": "todo|in-progress|done",
      "dueDate": "2024-12-31",
      "user": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Single Task
```
GET /api/tasks/:id
Headers: { "x-auth-token": "your_jwt_token" }
```

#### Create Task
```
POST /api/tasks
Headers: { "x-auth-token": "your_jwt_token" }
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "status": "todo",
  "dueDate": "2024-12-25"
}

Response: {
  "success": true,
  "task": { /* task object */ },
  "msg": "Task created successfully"
}
```

#### Update Task
```
PUT /api/tasks/:id
Headers: { "x-auth-token": "your_jwt_token" }
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "high"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Headers: { "x-auth-token": "your_jwt_token" }
```

#### Get Task Statistics
```
GET /api/tasks/stats/summary
Headers: { "x-auth-token": "your_jwt_token" }

Response: {
  "success": true,
  "stats": {
    "total": 10,
    "todo": 5,
    "inProgress": 3,
    "done": 2,
    "highPriority": 2
  }
}
```

#### Health Check
```
GET /api/health

Response: { "status": "ok", "message": "Server is running" }
```

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "msg": "Operation successful"
}
```

### Error Response
```json
{
  "msg": "Error message describing what went wrong"
}
```

## HTTP Status Codes

- `200` - OK: Successful request
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid input or validation error
- `401` - Unauthorized: Missing or invalid token
- `403` - Forbidden: User not authorized for this resource
- `404` - Not Found: Resource not found
- `500` - Server Error: Internal server error

## Validation Rules

### Email
- Must be a valid email format
- Must be unique (no duplicate registrations)
- Case-insensitive

### Password
- Minimum 6 characters
- Hashed before storage

### Task Title
- Required
- Maximum 200 characters
- Cannot be empty or whitespace only

### Task Description
- Optional
- Maximum 1000 characters

### Task Priority
- Enum: `low`, `medium`, `high`
- Default: `medium`

### Task Status
- Enum: `todo`, `in-progress`, `done`
- Default: `todo`

### Due Date
- Optional
- Must be a valid ISO 8601 date format

## Database Schema

### User Model
```javascript
{
  email: String (unique, lowercase, required),
  password: String (hashed, required),
  createdAt: Date (auto),
  lastLogin: Date,
  updatedAt: Date (auto)
}
```

### Task Model
```javascript
{
  user: ObjectId (reference to User),
  title: String (required, max 200),
  description: String (max 1000),
  priority: String (enum: low/medium/high),
  status: String (enum: todo/in-progress/done),
  dueDate: Date,
  completedAt: Date,
  tags: [String],
  subtasks: [{
    title: String,
    completed: Boolean,
    createdAt: Date
  }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Error Handling

The API includes comprehensive error handling:

- **Validation errors** - Clear messages for invalid input
- **Authentication errors** - Token validation and expiration
- **Authorization errors** - User can only access their own tasks
- **Database errors** - Graceful error messages
- **Server errors** - Generic error message in production

## Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - bcryptjs with salt rounds
3. **CORS** - Cross-Origin Resource Sharing configured
4. **Input Validation** - All inputs validated before processing
5. **Authorization Checks** - Users can only access their own data

## Development

### Project Structure
```
Backend/server/
├── index.js              # Main server file
├── .env                  # Environment variables
├── .env.example          # Example env file
├── package.json          # Dependencies
├── models/
│   ├── User.js          # User schema
│   └── Task.js          # Task schema
├── middleware/
│   └── auth.js          # JWT authentication middleware
└── routes/              # (Future: organize routes into separate files)
```

### Scripts
- `npm start` - Start the server
- `npm run dev` - Start in development mode

### Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Debugging

Enable debug logs by setting `NODE_ENV=development`:

```bash
NODE_ENV=development npm start
```

The server will output detailed logs for:
- Database connections
- Route registrations
- Errors and warnings

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Tasks (replace TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "x-auth-token: TOKEN"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "x-auth-token: TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Task",
    "priority":"high",
    "status":"todo"
  }'
```

## Deployment

### Environment-Specific Configuration

**Production (.env)**
```
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=very-secure-secret-key
PORT=5000
NODE_ENV=production
```

### Recommended Hosting
- **Heroku**, **Railway**, **Render** - Easy Node.js deployment
- **AWS EC2**, **DigitalOcean** - More control
- **MongoDB Atlas** - Cloud MongoDB hosting

## Performance Optimization

- Database indexing on `user` and `createdAt` fields
- Token-based authentication (stateless)
- Async/await for non-blocking operations
- Input validation to prevent malformed requests

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Task sharing and collaboration
- [ ] File attachments
- [ ] Task templates
- [ ] Advanced filtering and search
- [ ] Task history/audit logs
- [ ] Notifications
- [ ] Role-based access control

## Support

For issues or questions, please check:
1. Error logs in console output
2. Environment variables configuration
3. MongoDB connection status
4. JWT token validity

## License

This project is part of the Brew Software Developer Internship Assignment.
