# GitHub Copilot Instructions

This file provides coding patterns and conventions for the Pokédex application to help GitHub Copilot generate consistent code.

## Project Architecture

### Backend Dependency Injection Pattern

- **Always** get services from `appContainer` singleton (imported from `../container`)
- **Never** instantiate services or repositories directly
- Example controller pattern:

  ```typescript
  import { appContainer } from "../container";

  export const controllerName = async (req: Request, res: Response) => {
    const service = appContainer.getServiceName();
    // use service...
  };
  ```

### Service Layer

- Services contain business logic
- Services receive repositories via constructor injection
- Service class names: `XxxService` (e.g., `AuthService`, `PokemonService`, `UserPokemonService`)
- When creating a new service:
  1. Define constructor with repository dependencies
  2. Add getter method to Container class in `container.ts`
  3. Service will be lazily initialized as singleton

### Repository Layer

- Repositories handle data access only
- All repositories implement interfaces from `repositories/interfaces/`
- Repository implementations: `XxxRepositoryImpl` (e.g., `UserRepositoryImpl`)
- Repository interfaces: `IXxxRepository` (e.g., `IUserRepository`)
- Always inject repositories into service constructors

### Controllers

- Controllers live in `controllers/<feature>/` directories
- Controllers handle HTTP request/response only
- Get dependencies from `appContainer`
- Use Zod schemas for all request validation
- Return appropriate HTTP status codes (200, 201, 400, 401, 404, 500)

## Code Style

### TypeScript

- Always use explicit return types for functions
- Use `interface` for object types, not `type` aliases
- Never use `any`, prefer `unknown` if type is unclear
- All function parameters must be typed
- Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### Functions

- Prefer arrow functions for function expressions
- Use async/await over `.then()` chains
- Always handle errors with try-catch in async functions

### Imports

- Use named exports, avoid default exports
- Group imports: external libraries first, then internal modules
- Use absolute imports from `src/` where configured

## Validation

- **All** request validation must use Zod schemas
- Zod schemas live in `src/schemas/`
- Validate request bodies, params, and query strings
- Example:
  ```typescript
  const result = someSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  ```

## Database

### Drizzle ORM

- Schema definitions in `src/db/schema.ts`
- Use Drizzle query builder, not raw SQL
- Always use transactions for multi-step operations
- Access database through `db` from `src/db/client.ts`

### Schema Changes

- Update schema in `schema.ts` first
- Run `npm run drizzle:generate` to create migration
- Run `npm run migrate` to apply changes

## Authentication & Security

- Use JWT tokens for authentication
- Auth middleware validates Bearer tokens
- Store passwords with bcrypt hashing (salt rounds: 10)
- Protected routes must use `authenticateToken` middleware
- Never log sensitive data (passwords, tokens)

## Error Handling

### Backend

- Use try-catch blocks in all async route handlers
- Log errors with context (use logger middleware)
- Return appropriate status codes with error messages
- Example:
  ```typescript
  try {
    // logic
  } catch (error) {
    console.error("Context:", error);
    return res.status(500).json({ error: "Message" });
  }
  ```

### Frontend

- Let axios interceptors handle auth errors (401)
- Use TanStack Query error handling for API errors
- Display user-friendly error messages

## Frontend Patterns

### React Components

- Functional components only, no class components
- Use TypeScript for all components with proper prop types
- Component names: PascalCase (e.g., `PokemonCard`, `LoginForm`)
- Extract reusable components to `src/components/`

### State Management

- **Server state**: TanStack Query (useQuery/useMutation)
- **Auth state**: React Context (`AuthContext`)
- **Local state**: useState, useReducer
- Configure TanStack Query with 5-minute stale time
- Always provide query keys as arrays

### API Calls

- All API calls go through centralized axios instance (`services/api.ts`)
- Axios instance automatically adds auth tokens via interceptors
- Define API functions in appropriate service files (`services/auth.ts`, `services/pokemonService.ts`)
- Use TanStack Query hooks in components, never call API functions directly in render

### Routing

- Use React Router v6
- Protected routes wrapped in `<ProtectedRoute>`
- Public routes (login/register) wrapped in `<PublicRoute>`
- Route definitions in `App.tsx`

### Styling

- Tailwind CSS for all styling
- Use utility classes, avoid custom CSS files
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints

## Naming Conventions

### Backend

- Files: camelCase (e.g., `authController.ts`, `pokemonService.ts`)
- Classes: PascalCase (e.g., `AuthService`, `UserRepositoryImpl`)
- Functions: camelCase (e.g., `getUserById`, `validateToken`)
- Constants: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`, `PORT`)
- Interfaces: PascalCase with `I` prefix (e.g., `IUserRepository`)

### Frontend

- Components: PascalCase files and exports (e.g., `PokemonCard.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useAuth`, `usePokemon`)
- Utilities: camelCase (e.g., `formatDate`, `validateEmail`)
- Types: PascalCase (e.g., `Pokemon`, `User`, `ApiError`)

### Database

- Tables: camelCase (e.g., `users`, `pokemon`, `userPokemon`)
- Columns: camelCase (e.g., `pokemonId`, `createdAt`, `passwordHash`)

## Project-Specific Patterns

### Evolution Data

- Evolution stored as JSONB in `pokemon.evolution` column
- Format: `{ prev: [pokemonId, method], next: [[pokemonId, method], ...] }`
- Evolution tiers: 1 = base form, 2 = mid evolution, 3 = final evolution

### Pokemon Data

- Primary data stored in structured columns
- Full PokeAPI response in `data` JSONB column
- Types stored as array: `types: string[]`
- Sprites object contains image URLs

### User Collection

- Join table: `user_pokemon` (userId, pokemonId, caughtAt)
- Toggle endpoint for catch/release: `POST /api/me/collection/:pokemonId/toggle`
- Returns boolean indicating current caught status

## Testing Considerations

- Write testable code by depending on interfaces, not implementations
- Repository pattern enables easy mocking
- Keep business logic in services, not controllers
- Controllers should be thin wrappers

## Performance

- Use pagination for list endpoints (limit/offset params)
- Index foreign keys in database
- TanStack Query caching reduces API calls
- Lazy load routes with React.lazy() where appropriate

## Common Patterns to Follow

### Adding a New API Endpoint

1. Create Zod schema in `schemas/`
2. Create controller function in `controllers/<feature>/`
3. Get service from `appContainer`
4. Add route in appropriate router file
5. Add frontend API function in `services/`
6. Create TanStack Query hook if needed

### Adding a New Feature with Database

1. Update `schema.ts`
2. Generate and run migration
3. Create repository interface
4. Implement repository
5. Create service with repository injection
6. Add to container
7. Create controllers
8. Add routes
9. Create frontend API calls
10. Build UI components

## Environment Variables

### Backend (.env)

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for signing JWT tokens
- `PORT` - Server port (default: 3001)

### Frontend (.env)

- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

## Code Quality

- No unused imports or variables
- No console.logs in production code (use logger)
- Proper error messages for user-facing errors
- Comments only where logic isn't self-evident
- Keep functions small and single-purpose
- DRY: Extract repeated logic into utilities
