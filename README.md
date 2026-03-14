# 4AM Student Platform

## Project Structure

This project is organized into two main directories:

- **frontend/**: Contains the React application (Vite + TypeScript).
- **backend/**: Contains the Express server and MongoDB models.

## Tech Stack

### Frontend
- React 19.2.4 with TypeScript
- Vite 6.2.0 for build tooling
- TailwindCSS for styling
- React Router 7.13.1 for navigation
- Axios for API calls
- Framer Motion for animations
- Lucide React for icons

### Backend
- Node.js with ES modules
- Express 5.2.1
- MongoDB with Mongoose 9.2.3
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Getting Started

1. **Install Dependencies:**
   Run the following command in the root directory to install dependencies for both frontend and backend:
   ```bash
   npm run install:all
   ```

2. **Environment Setup:**
   - Backend: Create `.env` file in `backend/` directory
     ```
     MONGO_URI=mongodb://127.0.0.1:27017/4am-student-platform
     PORT=5000
     NODE_ENV=development
     JWT_SECRET=your_jwt_secret_here

   # Required for Forgot Password email delivery
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="4AM Student Platform <your-email@gmail.com>"

   # Frontend URL used in reset link
   CLIENT_URL=http://localhost:5173
     ```
   - Frontend: Create `.env.local` file in `frontend/` directory (if needed)
     ```
     VITE_API_URL=http://localhost:5000
     ```

3. **Database Setup:**
   - Ensure MongoDB is running locally.
   - Run the seed script to populate initial data:
     ```bash
     npm run seed
     ```

4. **Start Development Servers:**
   Run the following command to start both the backend server and frontend development server concurrently:
   ```bash
   npm start
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend will run on: `http://localhost:5000`

## Available Scripts

### Root Level
- `npm start` - Start both frontend and backend concurrently
- `npm run install:all` - Install dependencies for all packages
- `npm run backend` - Start backend only
- `npm run frontend` - Start frontend only
- `npm run seed` - Seed database with initial data

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- **Authentication**: JWT-based login/registration system
- **User Roles**: Student and Company profiles
- **Assessments**: Technical and soft skill assessments
- **Resume Builder**: Interactive resume creation tool
- **Job Board**: Company job postings and student applications
- **Mock Interviews**: AI-powered interview simulations
- **Career Path**: Personalized career recommendations
- **Achievements**: Gamified learning progress tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get specific assessment
- `POST /api/user-assessments` - Submit assessment

### Jobs
- `GET /api/jobs` - Get all active jobs
- `POST /api/jobs` - Create new job (Company only)
- `POST /api/jobs/:id/apply` - Apply for job (Student only)

## Project Structure Details

```
4am Student Website/
├── backend/
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── index.js           # Server entry point
│   ├── seed.js            # Database seeding
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── data/          # Static data
│   │   └── main.tsx       # App entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── package.json           # Root package configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of 4AM Global Media's educational platform.
