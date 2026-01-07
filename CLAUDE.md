# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Pokédex application with authentication, allowing users to browse Pokémon and manage their collection.

**Stack:**

- Backend: Express + TypeScript with Drizzle ORM
- Frontend: React + TypeScript with Vite, TanStack Query, React Router, Tailwind CSS
- Database: PostgreSQL (Docker)

## Development Commands

### Full Stack Development

```bash
# Start everything (database, backend, frontend) concurrently
npm run dev

# Start components individually
npm run dev:db        # Docker Compose (Postgres)
npm run dev:backend   # Backend server (nodemon with ts-node)
npm run dev:frontend  # Vite dev server
```

### Backend Commands

```bash
cd backend

# Development
npm run dev           # Start with nodemon + ts-node
npm run build         # Compile TypeScript to dist/
npm start             # Run compiled code from dist/

# Database Operations
npm run migrate                # Run migrations
npm run drizzle:generate       # Generate new migration from schema changes
npm run drizzle:migrate        # Apply migrations
npm run seed:pokemon           # Seed Pokémon data from /data/pokemon.json
npm run db:clean              # Clean database
npm run db:reset              # Clean + re-seed
```

### Frontend Commands

```bash
cd frontend

npm run dev           # Start Vite dev server
npm run build         # Build for production (runs tsc + vite build)
npm run lint          # Run ESLint
npm run preview       # Preview production build
```

## Architecture

### Backend Architecture

**Dependency Injection Pattern:**
The backend uses a singleton DI container ([backend/src/container.ts](backend/src/container.ts)) with lazy initialization for all services and repositories.

- **Container** (`appContainer`): Single instance managing all dependencies
- **Services**: Business logic layer (AuthService, PokemonService, UserPokemonService)
- **Repositories**: Data access layer implementing interfaces (UserRepositoryImpl, PokemonRepositoryImpl, UserPokemonRepositoryImpl)
- **Controllers**: Route handlers that get dependencies from container

**Directory Structure:**

- `src/app.ts` - Express app configuration and middleware setup
- `src/index.ts` - Server entry point
- `src/container.ts` - DI container with singleton pattern
- `src/controllers/` - Request handlers organized by feature
  - `auth/` - login, register controllers
  - `pokemon/` - getAllPokemon, getPokemonById, getUserCollection, etc.
- `src/services/` - Business logic (AuthService, PokemonService, UserPokemonService)
- `src/repositories/` - Data access implementations
  - `interfaces/` - Repository interfaces (IUserRepository, IPokemonRepository, IUserPokemonRepository)
- `src/db/` - Database configuration
  - `schema.ts` - Drizzle ORM schema (users, pokemon, userPokemon tables)
  - `client.ts` - Drizzle client singleton
- `src/middleware/` - auth.ts (JWT), logger.ts
- `src/routes/` - Route definitions (auth, pokemon, me)
- `src/schemas/` - Zod validation schemas
- `src/scripts/` - Database utilities (migrations, seeding, cleaning)

**Key Patterns:**

- Controllers retrieve services from `appContainer` (e.g., `appContainer.getPokemonService()`)
- Services receive repositories via constructor injection
- All validation uses Zod schemas
- Auth uses JWT with Bearer token, validated in middleware
- Repository pattern with interfaces for testability

### Frontend Architecture

**State Management:**

- **TanStack Query (React Query)** for server state with 5-minute stale time
- **React Context** for auth state (`AuthContext`)
- Local storage for JWT token and user data persistence

**Directory Structure:**

- `src/main.tsx` - App entry point with providers (QueryClient, BrowserRouter, AuthProvider)
- `src/App.tsx` - Route configuration with ProtectedRoute/PublicRoute
- `src/pages/` - Route components (LoginPage, PokemonPage, MyCollectionPage)
- `src/components/` - Reusable UI components, ProtectedRoute, PublicRoute
- `src/contexts/` - AuthContext with login/logout and token validation
- `src/services/` - API layer
  - `api.ts` - Axios instance with interceptors for auth tokens and error handling
  - `auth.ts` - Login/register API calls
  - `pokemonService.ts` - Pokémon and collection API calls
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/schemas/` - Validation schemas

**Auth Flow:**

- AuthContext checks localStorage for token on mount
- Token validated by calling a protected endpoint (`getUserCollection`)
- Axios interceptor adds `Authorization: Bearer <token>` to all requests
- 401 responses automatically clear localStorage

**API Communication:**

- Base URL: `VITE_API_URL` env var or `http://localhost:3001`
- Centralized Axios instance with request/response interceptors
- All API errors typed with ApiError interface

### Database Schema

**Tables:**

- `users` - User accounts (id, email, username, passwordHash, createdAt)
- `pokemon` - Pokémon data (id, name, pokedexNumber, types, sprites, stats, abilities, height, weight, evolution, data as JSONB)
- `user_pokemon` - Many-to-many join table (userId, pokemonId, caughtAt)

**Evolution Structure:**

- Stored as JSONB in pokemon.evolution column
- Format: `{ prev: [pokemonId, method], next: [[pokemonId, method], ...] }`
- Used for filtering by evolution tier (1 = base, 2 = mid, 3 = final)

## API Routes

**Authentication:**

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive JWT token

**Pokémon:**

- `GET /api/pokemon` - List all Pokémon (supports pagination, filtering by type/name/evolutionTier/description)
- `GET /api/pokemon/:id` - Get single Pokémon by ID

**User Collection (Protected):**

- `GET /api/me/collection` - Get user's caught Pokémon
- `POST /api/me/collection/:pokemonId/toggle` - Catch or release a Pokémon

## Environment Setup

**Backend** (create `backend/.env`):

```
DATABASE_URL=postgres://pokemon:pokemon@localhost:5432/pokedex
JWT_SECRET=your-secret-key
PORT=3001
```

**Frontend** (create `frontend/.env`):

```
VITE_API_URL=http://localhost:3001
```

**Database** is configured in docker-compose.yml with credentials: `pokemon:pokemon@localhost:5432/pokedex`

## Working with the Codebase

**Adding a new controller:**

1. Create controller in `backend/src/controllers/<feature>/`
2. Get required service from `appContainer` (e.g., `appContainer.getPokemonService()`)
3. Use Zod schema for request validation
4. Add route in appropriate router file

**Adding a new service:**

1. Create service class in `backend/src/services/`
2. Define constructor with repository dependencies
3. Add getter method to Container class in `container.ts`
4. Service will be lazily initialized as singleton

**Adding a new repository:**

1. Define interface in `backend/src/repositories/interfaces/`
2. Create implementation in `backend/src/repositories/`
3. Add getter method to Container class
4. Inject via service constructor

**Database changes:**

1. Update schema in `backend/src/db/schema.ts`
2. Run `npm run drizzle:generate` to create migration
3. Run `npm run migrate` to apply changes
4. Migrations stored in `backend/drizzle/`

**Frontend API calls:**

1. Add API function to appropriate service file
2. Use TanStack Query hooks (useQuery/useMutation) in components
3. Errors automatically handled by axios interceptors
