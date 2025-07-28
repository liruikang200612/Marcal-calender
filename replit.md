# MarCal - Marketing Calendar Application

## Overview

MarCal is a comprehensive marketing calendar application built with a modern full-stack architecture. The system provides intelligent calendar management with AI-powered recommendations, multi-region support, and drag-and-drop functionality for events. It's designed to help users manage marketing activities, holidays, and custom events across different regions with lunar calendar integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 18, 2025
- ✓ Successfully built complete MarCal marketing calendar application
- ✓ Set up PostgreSQL database with comprehensive schema
- ✓ Created full-stack architecture with React frontend and Express backend  
- ✓ Implemented AI-powered recommendations using OpenAI GPT-4o
- ✓ Added multi-language support (Chinese/English)
- ✓ Integrated drag-and-drop functionality for event management
- ✓ Seeded database with initial regions, event types, holidays, and sample events
- ✓ All core features working: calendar grid, event creation, AI recommendations, multi-region support

## System Architecture

The application follows a monolithic full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **React 19** with **TypeScript** for type safety
- **Vite** as the build tool and development server
- **Tailwind CSS** with **shadcn/ui** component library for styling
- **Wouter** for client-side routing (lightweight React router)
- **@tanstack/react-query** for server state management and caching
- **@dnd-kit** for drag-and-drop functionality
- Component-based architecture with custom hooks for business logic

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations and schema management
- **Neon Database** (PostgreSQL) for data persistence
- RESTful API design with structured error handling
- Service layer pattern for external integrations (OpenAI, Lunar calendar)

### Build and Development
- **esbuild** for server bundling in production
- **tsx** for TypeScript execution in development
- Unified build process that handles both client and server compilation

## Key Components

### Database Schema
The application uses a PostgreSQL database with the following main entities:
- **Regions**: Multi-region support with timezone management
- **Event Types**: Categorization system (holidays, marketing, custom)
- **Events**: Core event management with region and type associations
- **Holidays**: Regional holiday management with recurring support
- **Recommendations**: AI-generated event suggestions with confidence scoring
- **Users**: User management system (prepared for authentication)

### Calendar System
- Month-based calendar grid with lunar date integration
- Drag-and-drop event creation and management
- Multi-language support (Chinese/English)
- Event filtering by type and region
- Real-time event updates with optimistic UI

### AI Integration
- **OpenAI GPT-4o** integration for intelligent event recommendations
- Context-aware suggestions based on existing events and holidays
- Confidence scoring for recommendation quality
- Automated reasoning for marketing calendar optimization

### UI/UX Features
- Responsive design with mobile support
- Dark/light theme compatibility
- Comprehensive component library (40+ shadcn/ui components)
- Toast notifications for user feedback
- Loading states and error handling

## Data Flow

1. **Client Requests**: React components make API calls through react-query
2. **Server Processing**: Express routes handle requests and validate data using Drizzle schemas
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **External Services**: Server communicates with OpenAI for recommendations and lunar calendar services
5. **Response Handling**: Structured JSON responses with proper error codes
6. **Client Updates**: React-query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database client for PostgreSQL
- **@radix-ui/***: Accessible UI primitives for component library
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Type-safe CSS class variants
- **zod**: Runtime type validation

### Development Tools
- **drizzle-kit**: Database migration and schema management
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **@jridgewell/trace-mapping**: Source map support

### AI and External Services
- **OpenAI**: For AI-powered event recommendations
- **Lunar calendar services**: For Chinese traditional calendar integration

## Deployment Strategy

### Development
- **tsx** for running TypeScript server in development
- **Vite** dev server with HMR for client development
- Concurrent client and server development with middleware integration

### Production Build
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: esbuild bundles server to `dist/index.js`
3. **Static Assets**: Server serves built client files
4. **Database**: Drizzle migrations for schema deployment

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- OpenAI API key for AI features
- Replit-specific optimizations for the platform

The architecture emphasizes developer experience with hot reloading, type safety throughout the stack, and a clear separation of concerns while maintaining the simplicity of a monolithic deployment.