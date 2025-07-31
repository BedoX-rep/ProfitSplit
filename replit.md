# Business Profit Calculator

## Overview

This is a React-based profit sharing calculator application designed for business operations. The application allows users to input revenue and expenses, then calculates and distributes profits among company members based on configurable percentages. It features a modern UI built with shadcn/ui components and provides export/print functionality for results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks (useState, useCallback) for local state
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Development**: TSX for TypeScript execution in development
- **Production Build**: esbuild for bundling server code
- **Middleware**: Custom logging and error handling middleware
- **Storage Interface**: Abstracted storage layer with in-memory implementation

### Key Components

#### Client-Side Components
- **Calculator Page**: Main application interface with step-by-step input forms
- **Input Components**: Modular components for revenue, expenses, frames cost, and member management
- **Display Components**: Real-time calculation display and distribution summary
- **Action Components**: Export to CSV, print, and reset functionality

#### Shared Schema
- **Validation**: Zod schemas for type-safe data validation
- **Types**: Shared TypeScript interfaces between client and server
- **Business Logic**: Centralized calculation logic and currency formatting

#### UI System
- **Design System**: Comprehensive component library with consistent styling
- **Theming**: CSS custom properties for light/dark mode support
- **Responsive Design**: Mobile-first approach with breakpoint considerations
- **Accessibility**: ARIA-compliant components from Radix UI

## Data Flow

1. **User Input**: Users enter financial data through form components
2. **Real-time Calculation**: Changes trigger immediate recalculation of profit distribution
3. **State Management**: Local React state manages calculator inputs and results
4. **Display Updates**: UI components reactively update based on calculation results
5. **Export Operations**: Results can be exported to CSV or printed as summary reports

## External Dependencies

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Environment-based DATABASE_URL configuration

### UI and Styling
- **Component Library**: Extensive Radix UI component collection
- **Icons**: Lucide React icon library
- **Styling**: Tailwind CSS with PostCSS processing
- **Utilities**: Class variance authority for component variants

### Development Tools
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESM modules with modern JavaScript features
- **Development Server**: Vite with HMR and error overlay
- **Path Aliases**: Configured for clean imports (@/, @shared/)

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with React Fast Refresh
- **Error Handling**: Runtime error modal for debugging
- **Logging**: Custom request logging with performance metrics
- **File Serving**: Vite middleware for static asset serving

### Production Build
- **Client Build**: Vite optimizes and bundles React application
- **Server Build**: esbuild bundles Express server for Node.js
- **Static Assets**: Built to dist/public for efficient serving
- **Environment**: NODE_ENV-based configuration switching

### Database Management
- **Schema Sync**: `npm run db:push` for development schema updates
- **Migration System**: Drizzle migrations in dedicated migrations folder
- **Environment Config**: Secure DATABASE_URL handling with validation

The application is structured as a monorepo with clear separation between client, server, and shared code, enabling efficient development and deployment workflows.