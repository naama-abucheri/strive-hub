# StriveHub - Personal Goal & Habit Tracker

## Overview

StriveHub is a comprehensive goal-setting and habit-tracking application that helps users transform their goals into reality through progress tracking, habit building, and detailed analytics. The application is built with a modern tech stack featuring React, Express.js, and PostgreSQL, designed to provide a responsive and intuitive user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React 18 with TypeScript for type safety. The architecture follows a component-based design using:
- **React Hooks and Functional Components**: Modern React patterns for state management and lifecycle handling
- **Wouter**: Lightweight client-side routing for navigation between pages (Dashboard, Goals, Habits, Analytics)
- **TanStack Query**: Handles data fetching, caching, and synchronization with the backend
- **Tailwind CSS + Shadcn/UI**: Utility-first styling with high-quality pre-built components
- **React Hook Form**: Form handling with validation for goal and habit creation/editing

### Backend Architecture
The server-side uses Express.js with TypeScript, following a RESTful API design:
- **Express.js**: Web application framework handling HTTP requests and middleware
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Session-based Authentication**: Using Replit Auth with PostgreSQL session storage
- **Modular Route Handling**: Organized API endpoints for goals, habits, analytics, and authentication

### Authentication Strategy
The application uses Replit's OAuth integration:
- **Problem**: Secure user authentication and session management
- **Solution**: Replit Auth with OpenID Connect, storing sessions in PostgreSQL
- **Benefits**: Eliminates need for custom auth implementation, leverages Replit's security infrastructure
- **Session Storage**: PostgreSQL-backed sessions for persistence and scalability

## Key Components

### Data Models
- **Users**: Profile information from Replit Auth (email, name, profile image)
- **Goals**: User-created goals with titles, descriptions, deadlines, status, and progress tracking
- **Habits**: Daily habits with categories, completion tracking, and streak calculations
- **Habit Completions**: Records of daily habit completions for analytics

### Core Features
1. **Goal Management**: CRUD operations for goals with progress tracking and status management
2. **Habit Tracking**: Daily habit check-offs with streak tracking and categorization
3. **Analytics Dashboard**: Visual charts showing progress, streaks, and category breakdowns
4. **Responsive Design**: Mobile-first design with sidebar navigation and mobile sheet overlays

### UI Components
- **Reusable Components**: Shadcn/UI components for consistent design system
- **Form Components**: Goal and habit forms with validation and error handling
- **Data Visualization**: Chart.js integration for analytics displays
- **Navigation**: Sidebar for desktop, sheet overlay for mobile

## Data Flow

1. **Authentication Flow**: User logs in via Replit Auth → Session created in PostgreSQL → User data retrieved and cached
2. **Goal/Habit CRUD**: Frontend forms → TanStack Query → API endpoints → Drizzle ORM → PostgreSQL
3. **Analytics Pipeline**: Database aggregations → API endpoints → Chart.js visualization
4. **Real-time Updates**: Query invalidation after mutations ensures UI stays synchronized

## External Dependencies

### Authentication
- **Replit Auth**: OAuth provider for user authentication
- **OpenID Connect**: Authentication protocol implementation

### Database
- **Neon Database**: PostgreSQL hosting service (via @neondatabase/serverless)
- **Connection Pooling**: Managed database connections for performance

### UI Libraries
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Chart.js**: Data visualization for analytics charts

### Development Tools
- **Vite**: Build tool for fast development and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- **Problem**: Fast development iteration and hot reloading
- **Solution**: Vite dev server with Express backend in development mode
- **Benefits**: Hot module replacement, fast builds, integrated development experience

### Production Build
- **Problem**: Optimized static assets and server bundling
- **Solution**: Vite builds client assets, ESBuild bundles server code
- **Deployment**: Static client files served by Express, single Node.js process

### Database Management
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Environment Variables**: DATABASE_URL for connection, SESSION_SECRET for security
- **Session Storage**: PostgreSQL table for persistent user sessions

### Scalability Considerations
- **Database Connection Pooling**: Neon serverless handles connection management
- **Static Asset Serving**: Client files served efficiently by Express
- **Query Optimization**: TanStack Query provides caching and request deduplication