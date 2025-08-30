# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack  
- `npm run start` - Start production server
- `npm run init-data` - Initialize MongoDB with mock sales coaching cases

### Code Quality
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database Setup
- `npx tsx scripts/initMockData.ts` - Populate database with 6 customer personas

## Architecture

### Core Structure
This is a Next.js 15 sales coaching platform with cookie-based authentication and MongoDB data persistence.

**Authentication Flow**: Cookie-based sessions using `userId` cookie → `getCurrentUser()` in `/src/lib/auth.ts` → MongoDB User lookup

**Data Models**:
- `User` (src/models/User.ts): Username/password with validation
- `Case` (src/models/Case.ts): Customer personas with metadata (budget, personality, background)

**Key Directories**:
- `/src/app/` - Next.js App Router pages and API routes
- `/src/models/` - Mongoose schemas  
- `/src/lib/` - Database connection, auth utilities, and data helpers
- `/src/hooks/` - React hooks (useAuth)
- `/scripts/` - Database initialization utilities

### Database Connection
MongoDB connection is handled through `/src/lib/mongodb.ts` with connection caching. The `MONGODB_URI` environment variable is required.

### Customer Cases System
The platform provides 6 progressive customer personas (orderIndex 1-6):
1. 友好的张先生 (Friendly beginner)
2. 挑剔的李女士 (Detail-oriented technical director)  
3. 犹豫的王总 (Cautious CEO)
4. 急躁的陈经理 (Impatient project manager)
5. 专业的刘博士 (Technical expert CTO)
6. 苛刻的周总监 (Demanding procurement director)

Each case includes personality traits, decision level, budget range, and specific challenge points.

### Technology Stack
- **Framework**: Next.js 15 with TypeScript and Turbopack
- **Database**: MongoDB with Mongoose ODM
- **UI**: Chakra UI v3 with Framer Motion
- **Styling**: Tailwind CSS v4
- **Auth**: Cookie-based sessions (no external auth provider)

## Environment Setup
Copy `.env.example` to `.env.local` and configure:
```
MONGODB_URI=mongodb://localhost:27017/sales-coach
```