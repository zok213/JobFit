# JobFit.AI - AI-Powered Job Matching Platform

## Project Overview

JobFit.AI is a full-stack web application that leverages artificial intelligence to match job seekers with suitable employment opportunities. The platform provides various AI-powered tools including resume analysis, job matching, career roadmap planning, and interview preparation.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: 
  - PostgreSQL (Aiven Cloud)
  - MongoDB (for document storage)
  - Redis (for caching and rate limiting)
- **Authentication**: 
  - JWT-based authentication
  - Supabase integration
- **AI Integration**:
  - OpenAI
  - Google Gemini
  - OpenRouter
  - HuggingFace
- **Deployment**: Not specified in provided files

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **UI Components**:
  - Custom UI components
  - Animation: Framer Motion
- **State Management**:
  - Context API
  - Possibly Zustand (based on dependencies)
- **Authentication**: 
  - Supabase integration
- **Testing**:
  - Jest
  - React Testing Library

## Project Structure

### Backend Structure
```
Backend/
├── api/ - API endpoint definitions
│   ├── ai.py - AI service endpoints
│   ├── auth.py - Authentication endpoints
│   ├── auth_supabase.py - Supabase auth integration
│   ├── interviews.py - Interview-related endpoints
│   ├── jobs.py - Job-related endpoints
│   ├── resumes.py - Resume-related endpoints
│   ├── roadmaps.py - Career roadmap endpoints
│   ├── test.py - Testing endpoints
│   └── users.py - User management endpoints
├── db/ - Database configuration
│   ├── database.py - Database connection setup
│   └── models.py - SQLAlchemy model imports
├── middleware/ - Middleware components
│   └── rate_limiter.py - API rate limiting
├── models/ - Data models
│   ├── job.py - Job-related models
│   ├── resume.py - Resume-related models
│   └── user.py - User-related models
├── schemas/ - Pydantic schemas for validation
│   ├── auth.py
│   ├── interviews.py
│   ├── job.py
│   ├── resume.py
│   └── user.py
├── services/ - Business logic services
│   ├── ai_service.py - Core AI integration
│   ├── cv_screening.py - Resume analysis
│   ├── document_processor.py - Document handling
│   ├── interview_ai.py - AI interview preparation
│   ├── rag_bot.py - Retrieval Augmented Generation
│   ├── resume_generator.py - Resume creation assistance
│   ├── resume_parser.py - Resume parsing
│   └── roadmap_ai.py - Career roadmap planning
└── tests/ - Backend tests
```

### Frontend Structure
```
Frontend/
├── app/ - Next.js app router pages
│   ├── api/ - API routes
│   ├── dashboard/ - Dashboard page
│   ├── cv-assistant/ - CV assistant feature
│   ├── employer/ - Employer section
│   ├── interviewer/ - Interview preparation
│   ├── job-match/ - Job matching feature
│   ├── roadmap/ - Career roadmap feature
│   └── [various other pages]
├── components/ - React components
│   ├── ai-cv-assistant/ - CV assistant components
│   ├── ai-interviewer/ - Interview components
│   ├── ai-job-match/ - Job matching components
│   ├── ai-roadmap/ - Roadmap components
│   ├── employer/ - Employer components
│   ├── profile/ - User profile components
│   ├── ui/ - UI component library
│   └── [various other components]
├── context/ - React context providers
│   └── AuthContext.tsx - Authentication context
├── lib/ - Utility functions
├── public/ - Static assets
└── styles/ - CSS styles
```

## Core Features

### 1. AI-Powered Job Matching
- Analyzes resumes and job descriptions to calculate match scores
- Provides personalized job recommendations
- Supports uploading CVs and entering job details

### 2. CV/Resume Assistant
- Resume analysis and scoring
- Resume building with AI assistance
- Resume editing with structured sections

### 3. Career Roadmap Planning
- Generates personalized career roadmaps
- Visualizes career progression paths
- Recommends skills, certifications, and learning resources

### 4. AI Interview Preparation
- Simulates interview experiences
- Generates job-specific interview questions
- Provides feedback on interview responses

### 5. User Management
- Registration and authentication
- User profile management
- Role-based access (candidate, recruiter, admin)

### 6. Employer Dashboard
- Job posting and management
- Candidate screening and evaluation
- Analytics and reporting

## Database Models

### User Models
- User (authentication and core user data)
- UserProfile (detailed user information)
- UserSettings (user preferences)
- UserSkill (user skills and proficiency)

### Job Models
- Job (job posting details)
- JobSkill (skills required for a job)
- JobMatchScore (matching between users and jobs)
- JobApplication (user applications to jobs)
- JobFavorite (saved/favorite jobs)

### Resume Models
- Resume (resume metadata and storage)
- Education (educational background)
- Experience (work experience)
- ResumeSkill (skills listed in resume)

## API Endpoints

### Authentication
- `/api/auth/register` - User registration
- `/api/auth/token` - Login and token generation
- `/api/auth/me` - Get current user info

### User Management
- `/api/users/profile` - User profile CRUD
- `/api/users/settings` - User settings management

### Resume Management
- `/api/resumes/` - Resume CRUD
- `/api/resumes/{resume_id}/education` - Education entries management
- `/api/resumes/{resume_id}/experience` - Experience entries management
- `/api/resumes/{resume_id}/skills` - Skills management

### Job Management
- `/api/jobs/` - Job listing and creation
- `/api/jobs/{job_id}` - Job details and management
- `/api/jobs/{job_id}/match` - Get job match scores
- `/api/jobs/favorites` - Favorite jobs management

### AI Services
- `/api/ai/generate` - Text generation with AI
- `/api/ai/embed` - Text embedding generation
- `/api/ai/providers` - List available AI providers

### Career Roadmap
- `/api/roadmaps/generate` - Generate career roadmap
- `/api/roadmaps/skills-gap` - Analyze skills gap
- `/api/roadmaps/next-steps` - Get career next steps

### Interview Preparation
- `/api/interviews/applications/{application_id}/questions` - Generate interview questions
- `/api/interviews/applications/{application_id}/prepare` - Prepare for interview

## Development Setup

### Backend Setup
1. Install Python dependencies: `pip install -r requirements.txt`
2. Set up environment variables (see `.env` or `.env.local`)
3. Run the FastAPI server: `uvicorn main:app --reload`

### Frontend Setup
1. Install Node.js dependencies: `npm install`
2. Set up environment variables (see `.env` or `.env.local`)
3. Run the Next.js development server: `npm run dev`

## Authentication Flow

The application uses a hybrid authentication approach:
1. Supabase integration for frontend-backend authentication
2. JWT-based authentication as a fallback mechanism
3. Support for social login (Google, Facebook, GitHub)

## AI Integration

The platform integrates with multiple AI providers:
- OpenAI (default for most features)
- Google Gemini
- OpenRouter
- HuggingFace

Key AI features include:
- Text generation for various content
- Embeddings for semantic similarity
- Document parsing and analysis
- Retrieval-augmented generation for knowledge-based responses

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Default: 100 requests per minute
- Configurable via environment variables
- Redis-based implementation for distributed environments 