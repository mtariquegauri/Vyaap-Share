# Overview

This is a mobile-first marketing automation platform designed specifically for small Indian businesses and shopkeepers. The application helps local businesses (kirana stores, electronics shops, boutiques, etc.) create and manage AI-powered marketing campaigns in multiple languages including Hindi, English, and Hinglish. It provides tools for WhatsApp message generation, festival banner creation, customer management, and business analytics with culturally relevant content for the Indian market.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built as a React Single Page Application (SPA) using:
- **React 18** with TypeScript for component development
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and data fetching
- **Tailwind CSS** with custom Indian color palette (saffron, deep-saffron, indian-green) for styling
- **Shadcn/ui** components with Radix UI primitives for consistent UI elements
- **Mobile-first responsive design** optimized for smartphone usage
- **Multi-language support** with English and Hindi interface switching

## Backend Architecture
The server follows a Node.js Express architecture with:
- **Express.js** server with TypeScript for API endpoints
- **RESTful API design** with routes for shops, customers, campaigns, WhatsApp messages, banners, and analytics
- **Modular route structure** separating concerns by entity type
- **Request/response logging middleware** for API monitoring
- **Error handling middleware** for consistent error responses
- **Development/production environment configuration** with Vite integration

## Data Storage Solutions
- **Drizzle ORM** with PostgreSQL for database operations and schema management
- **Neon Database** serverless PostgreSQL for cloud hosting
- **Schema-first approach** with Zod validation for type safety
- **Database tables** for users, shops, customers, campaigns, WhatsApp messages, and banners
- **Memory storage fallback** for development and testing scenarios

## Authentication and Authorization
- **User-based authentication** with username/password system
- **Shop ownership model** linking users to their business profiles
- **Session-based approach** with secure credential handling
- **User context** maintained throughout the application

## External Service Integrations
- **OpenAI GPT-4** integration for AI-powered content generation
- **WhatsApp Business API** compatibility for message marketing
- **Multi-language AI prompts** supporting English, Hindi, and Hinglish content
- **Festival and occasion-based content generation** tailored to Indian market
- **Business insights and analytics** generation using AI

## Key Design Patterns
- **Component composition** with reusable UI building blocks
- **Custom hooks** for mobile detection and toast notifications
- **Context providers** for global state management
- **Form validation** using React Hook Form with Zod schemas
- **Optimistic updates** with TanStack Query mutations
- **Cultural localization** with Indian festivals, colors, and language preferences
- **Mobile-optimized UX** with bottom navigation and touch-friendly interfaces

# External Dependencies

- **Neon Database** - Serverless PostgreSQL database hosting
- **OpenAI API** - GPT-4 model for AI content generation
- **Shadcn/ui Component Library** - Pre-built React components with Radix UI
- **Google Fonts** - Inter and Noto Sans Devanagari font families
- **Replit Development Tools** - Cartographer plugin and error modal for development
- **Recharts** - Data visualization library for analytics charts
- **Date-fns** - Date manipulation and formatting utilities
- **Embla Carousel** - Touch-friendly carousel component for mobile interfaces