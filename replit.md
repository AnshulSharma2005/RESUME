# Resume Craft

## Overview

Resume Craft is a modern full-stack web application for creating, managing, and optimizing resumes. The platform features an experience-level-based template system, built-in ATS (Applicant Tracking System) scoring, and professional PDF export capabilities. Users can authenticate via email or Google, create multiple resumes using various templates, and receive feedback to improve their resume's compatibility with ATS systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for fast development and builds
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Comprehensive component library including dialogs, forms, tables, and interactive elements

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **API Design**: RESTful API with structured error handling and request/response logging middleware
- **Data Storage**: In-memory storage implementation with interface for easy database swapping

### Authentication System
- **Provider**: Firebase Authentication supporting email/password and Google OAuth
- **Session Management**: Firebase handles authentication state with React context for user management
- **User Data**: Local user profiles stored in application database, synced with Firebase users

### Data Architecture
- **Schema Design**: Shared TypeScript schemas using Drizzle and Zod for consistent validation
- **Core Entities**: Users, Resumes, and ATS Analyses with proper foreign key relationships
- **Content Structure**: JSON-based resume content storage supporting flexible template rendering

### Template System
- **Experience-Based**: Templates categorized by experience level (beginner, mid-career, professional)
- **Categories**: Professional, modern, creative, and academic template styles
- **Rendering**: Dynamic template renderer supporting multiple layout styles and color schemes

### ATS Scoring Engine
- **Analysis**: Client-side resume analysis for keywords, formatting, content quality, and length
- **Feedback**: Detailed scoring with section-by-section recommendations
- **Tracking**: Historical ATS analysis storage with usage limits

## External Dependencies

### Authentication Services
- **Firebase**: Complete authentication solution with email/password and Google OAuth providers
- **Google OAuth**: Social login integration through Firebase

### Database Infrastructure
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle Kit**: Database migrations and schema management

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible primitive components for complex UI elements
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool with HMR and TypeScript support
- **ESBuild**: Fast bundling for production builds
- **TypeScript**: Type safety across the entire application stack

### PDF Generation
- **jsPDF**: Client-side PDF generation for resume exports
- **Custom Export Service**: Template-aware PDF generation with proper formatting

### Additional Libraries
- **React Beautiful DnD**: Drag and drop functionality for resume section reordering
- **Date-fns**: Date manipulation and formatting utilities
- **UUID**: Unique identifier generation for entities
- **React Day Picker**: Calendar components for date selection