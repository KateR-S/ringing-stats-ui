# Contributing to Ringing Stats UI

Thank you for your interest in contributing to the Ringing Stats UI project!

## Code of Conduct

Please be respectful and constructive in all interactions.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ringing-stats-ui.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Coding Standards

### Code Style

- **Formatting**: We use Prettier for consistent code formatting
  - Run `npm run format` before committing
  - Configuration in `.prettierrc`
  
- **Linting**: ESLint is configured with Next.js recommended rules
  - Run `npm run lint` to check for issues
  - Configuration in `.eslintrc.json`

- **TypeScript**: All code must be properly typed
  - No `any` types unless absolutely necessary
  - Use interfaces for object shapes
  - Run `npx tsc --noEmit` to type check

### Directory Structure

Follow the Next.js App Router conventions:

```
app/                    # Pages and layouts
  layout.tsx           # Root layout
  page.tsx             # Home page
  [feature]/           # Feature-specific pages
    page.tsx

components/            # React components
  ui/                  # Base UI components (shadcn/ui)
  [component].tsx      # Feature components

lib/                   # Utilities and helpers
  api.ts              # API client
  types.ts            # TypeScript types
  utils.ts            # Helper functions
```

### Component Guidelines

1. **Use TypeScript**: Always type your components and props
2. **Client Components**: Add `'use client'` directive when needed
3. **Naming**: Use PascalCase for components, camelCase for functions
4. **Exports**: Use named exports for components

Example:
```typescript
'use client';

import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState(false);
  
  return (
    <div>
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
}
```

### State Management

- Use React Query for server state
- Use React hooks (useState, useEffect) for local state
- Session storage for data that needs to persist across pages

### API Integration

- All API calls go through `lib/api.ts`
- Use typed responses matching `lib/types.ts`
- Handle errors appropriately with try-catch or error boundaries

## Testing Your Changes

Before submitting a PR:

1. **Build**: `npm run build` - Ensure the project builds
2. **Type Check**: `npx tsc --noEmit` - No TypeScript errors
3. **Lint**: `npm run lint` - No linting errors
4. **Format**: `npm run format:check` - Code is properly formatted
5. **Manual Testing**: Test your changes in the browser

## Commit Messages

Use clear, descriptive commit messages:

```
Add tower selection caching feature

- Implement cache save on selection change
- Load cached data on page mount
- Add loading states for cache operations
```

## Pull Request Process

1. Update documentation if you've changed functionality
2. Ensure all tests pass and code is formatted
3. Provide a clear description of changes in the PR
4. Link any related issues
5. Request review from maintainers

## Questions?

Open an issue for any questions about contributing!
