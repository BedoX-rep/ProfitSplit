# Business Profit Calculator

## Overview

This is a React-based profit sharing calculator application designed for business operations, built with a serverless-first architecture. The application follows a specific business flowchart to calculate net profit and distribute it among company members, with special handling for the company member (tax and frames cost refunds). It features a modern UI, real-time calculations, save/load functionality, and export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Architecture preference: React frontend with TypeScript/JavaScript serverless functions backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks (useState, useCallback) for local state
- **Data Fetching**: TanStack Query (React Query) for API state management
- **API Integration**: Custom hooks for calculation, saving, and loading

### Backend Architecture - Serverless Functions
- **API Functions**: TypeScript serverless functions compatible with Vercel/Netlify
- **Development Server**: Express.js for local development
- **Storage**: In-memory storage with abstracted interface (easily replaceable)
- **Validation**: Zod schemas for request/response validation
- **Endpoints**: Calculate profit, save calculations, retrieve history

### Key Components

#### Client-Side Components
- **Calculator Page**: Main application interface with step-by-step input forms
- **Input Components**: Modular components for revenue, expenses, frames cost, and member management
- **Display Components**: Real-time calculation display and distribution summary
- **Action Components**: Save, export to CSV, print, and reset functionality
- **History Components**: Recent calculations list with load/view capabilities

#### API Integration
- **Custom Hooks**: useCalculateProfit, useCalculation, useRecentCalculations
- **Error Handling**: Toast notifications for user feedback
- **Optimistic Updates**: Real-time UI updates with server synchronization
- **Caching**: TanStack Query for intelligent data caching and invalidation

#### Serverless Functions
- **POST /api/calculate**: Validate input and save calculation with results
- **GET /api/calculations**: Retrieve recent calculation history
- **GET /api/calculations/:id**: Load specific saved calculation

#### Shared Schema
- **Validation**: Zod schemas for type-safe data validation across client/server
- **Types**: Shared TypeScript interfaces for calculation input/output
- **Business Logic**: Profit calculation following specific flowchart requirements

#### UI System
- **Design System**: Comprehensive component library with consistent styling
- **Theming**: CSS custom properties for light/dark mode support
- **Responsive Design**: Mobile-first approach with breakpoint considerations
- **Accessibility**: ARIA-compliant components from Radix UI

## Data Flow

1. **User Input**: Users enter financial data through form components
2. **Real-time Calculation**: Changes trigger immediate local recalculation for instant feedback
3. **Save to Server**: Users can save calculations via API for persistence
4. **History Access**: Recent calculations loaded from server with caching
5. **Export Operations**: Results can be exported to CSV or printed as summary reports

## Deployment Strategy

### Serverless Deployment
- **Vercel**: Zero-config deployment with automatic serverless functions
- **Netlify**: Functions deployment with build optimization
- **Traditional**: Static hosting with separate API deployment

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