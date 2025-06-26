# Audio Manager Application

## Overview

This is a React-based audio management application built with TypeScript that allows users to generate, play, and manage audio files for a Rock Paper Scissors Battle game. The application features a modern UI built with shadcn/ui components and uses Web Audio API for real-time audio generation and playback.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Development Environment
- **Platform**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Development Server**: Vite dev server with HMR (Hot Module Replacement)
- **Build Process**: Vite for client build, esbuild for server bundling

## Key Components

### Audio System
- **Audio Service**: Custom Web Audio API wrapper for generating procedural audio
- **Audio Generator**: Component for creating different types of sounds (tones, melodies, noise)
- **Audio Card**: Interactive UI component for playing and managing individual audio files
- **Volume Controls**: Master, SFX, and ambient volume management with real-time adjustment

### Data Management
- **Database Schema**: User management and audio file metadata storage
- **File Storage**: Local file system storage for generated audio assets
- **Memory Storage**: In-memory storage implementation for development (can be replaced with database)

### UI Components
- **Modern Design System**: Based on shadcn/ui with consistent theming
- **Responsive Layout**: Mobile-first design with adaptive components
- **Interactive Controls**: Volume sliders, play/pause buttons, download functionality
- **Visual Feedback**: Loading states, toasts, and status indicators

## Data Flow

1. **Audio Generation**: Web Audio API generates procedural sounds based on predefined parameters
2. **Playback Management**: Audio service manages multiple concurrent audio streams with volume mixing
3. **File Management**: Generated audio buffers are stored and managed for repeated playback
4. **User Interface**: React components provide real-time feedback and control over audio system
5. **Persistence**: Audio metadata is stored in PostgreSQL, with file assets saved locally

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- TypeScript for type safety
- Vite for build tooling and development server

### UI and Styling
- Radix UI primitives for accessible component foundations
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- shadcn/ui component library

### Backend and Database
- Express.js for server framework
- Drizzle ORM for type-safe database operations
- Neon Database for serverless PostgreSQL hosting
- Connect-pg-simple for session management

### Audio and Utilities
- Web Audio API (native browser API)
- TanStack Query for server state management
- Date-fns for date manipulation
- Zod for runtime type validation

## Deployment Strategy

### Development
- **Local Development**: Replit environment with live reload
- **Database**: Neon Database serverless PostgreSQL instance
- **Hot Reload**: Vite HMR for instant feedback during development

### Production
- **Build Process**: 
  - Client: Vite builds React app to `dist/public`
  - Server: esbuild bundles Express server to `dist/index.js`
- **Deployment Target**: Replit Autoscale deployment
- **Port Configuration**: Server runs on port 5000, external port 80
- **Asset Serving**: Static assets served from local file system

### Database Management
- **Schema Migrations**: Drizzle Kit handles schema changes
- **Environment Variables**: `DATABASE_URL` required for database connection
- **Session Storage**: PostgreSQL-backed sessions for user state persistence

## Changelog
- June 26, 2025. Initial setup with modern audio generation system
- June 26, 2025. Added complete retro audio system with 8-bit sound chip emulation

## User Preferences

Preferred communication style: Simple, everyday language.