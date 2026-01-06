# 🚀 StackBoard - TanStack Start & Query Demo

A comprehensive showcase of **TanStack Start** and **TanStack Query** features, demonstrating modern full-stack React development patterns including SSR, server functions, API routes, and advanced data fetching strategies.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Demo Routes](#-demo-routes)
- [Architecture](#-architecture)
- [Key Concepts](#-key-concepts)
- [Development](#-development)

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

---

## 🎯 Project Overview

**StackBoard** is a production-ready starter template demonstrating:

- ✅ **TanStack Start** - Full-stack React framework with SSR/SSG capabilities
- ✅ **TanStack Query** - Powerful async state management
- ✅ **TanStack Router** - Type-safe file-based routing
- ✅ **Server Functions** - Type-safe RPC calls between client and server
- ✅ **API Routes** - RESTful API endpoints with full-stack type safety
- ✅ **Multiple Rendering Modes** - SSR, SPA, and hybrid approaches

### 🛠️ Tech Stack

| Category          | Technology                              |
| ----------------- | --------------------------------------- |
| **Framework**     | TanStack Start (React 19)               |
| **Data Fetching** | TanStack Query v5                       |
| **Routing**       | TanStack Router v1 (File-based)         |
| **Styling**       | Tailwind CSS v4                         |
| **Build Tool**    | Vite 7                                  |
| **Type Safety**   | TypeScript 5.7                          |
| **Dev Tools**     | TanStack DevTools, React Query DevTools |

---

## ✨ Core Features

### 1. **TanStack Query Integration**

Advanced data fetching with caching, background updates, and optimistic mutations:

- ✅ Client-side data fetching with automatic caching
- ✅ Mutations with automatic refetching
- ✅ Optimistic updates
- ✅ Background synchronization
- ✅ Integrated DevTools

**Example:** [/demo/tanstack-query](src/routes/demo/tanstack-query.tsx) - Full CRUD todo app with mutations

### 2. **Server Functions**

Type-safe server-side functions callable from the client:

- ✅ RPC-style server calls
- ✅ File system operations
- ✅ Input validation
- ✅ Full type safety from server to client

**Example:** [/demo/start/server-funcs](src/routes/demo/start.server-funcs.tsx) - Todo app using server functions

### 3. **Multiple Rendering Strategies**

Choose the right rendering strategy for each route:

| Mode              | Use Case                                     | Example                                              |
| ----------------- | -------------------------------------------- | ---------------------------------------------------- |
| **Full SSR**      | SEO-critical pages, initial load performance | [full-ssr](src/routes/demo/start.ssr.full-ssr.tsx)   |
| **SPA Mode**      | Client-only interactivity                    | [spa-mode](src/routes/demo/start.ssr.spa-mode.tsx)   |
| **Data-Only SSR** | Pre-fetch data, client-side render           | [data-only](src/routes/demo/start.ssr.data-only.tsx) |

### 4. **API Routes**

RESTful API endpoints integrated into the application:

- ✅ JSON API responses
- ✅ Request handling (GET, POST, etc.)
- ✅ Consumed by TanStack Query

**Examples:**

- [/demo/api/names](src/routes/demo/api.names.ts) - GET endpoint
- [/demo/api/tq-todos](src/routes/demo/api.tq-todos.ts) - GET/POST endpoint

---

## 🎨 Demo Routes

Explore live examples of each feature:

### 📍 TanStack Query Demos

| Route                     | Description                | Key Features                                 |
| ------------------------- | -------------------------- | -------------------------------------------- |
| `/demo/tanstack-query`    | Todo list with mutations   | `useQuery`, `useMutation`, automatic refetch |
| `/demo/start/api-request` | Fetch data from API routes | `useQuery` with API integration              |

### 📍 TanStack Start Demos

| Route                       | Description                   | Key Features                             |
| --------------------------- | ----------------------------- | ---------------------------------------- |
| `/demo/start/server-funcs`  | Server functions todo app     | `createServerFn`, file system operations |
| `/demo/start/ssr/full-ssr`  | Server-side rendering         | Route `loader`, SSR data fetching        |
| `/demo/start/ssr/spa-mode`  | Client-only rendering         | `ssr: false`, client-side data loading   |
| `/demo/start/ssr/data-only` | Pre-fetch data, client render | Hybrid approach                          |
| `/demo/start/ssr`           | SSR overview page             | Navigation to all SSR demos              |

### 📍 Application Routes

| Route                     | Description                             |
| ------------------------- | --------------------------------------- |
| `/`                       | Homepage with feature overview          |
| `/app`                    | Protected app section (auth middleware) |
| `/app/login`              | Login page                              |
| `/app/product/$productId` | Dynamic product route with params       |

---

## 🏗️ Architecture

### Directory Structure

```
src/
├── routes/                    # File-based routing
│   ├── __root.tsx            # Root layout with providers
│   ├── index.tsx             # Homepage
│   ├── app/                  # Application routes
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── product.$productId.tsx
│   └── demo/                 # Demo/example routes
│       ├── tanstack-query.tsx
│       ├── start.server-funcs.tsx
│       ├── start.ssr.*.tsx
│       ├── api.names.ts      # API route
│       └── api.tq-todos.ts   # API route
│
├── components/               # Reusable components
│   └── Header.tsx
│
├── integrations/             # Third-party integrations
│   └── tanstack-query/
│       ├── root-provider.tsx # Query client setup
│       └── devtools.tsx      # DevTools configuration
│
├── middleware/               # Route middleware
│   └── auth.ts              # Authentication
│
├── data/                    # Mock data/utilities
│   └── demo.punk-songs.ts
│
├── types/                   # TypeScript types
│   └── product.ts
│
├── router.tsx              # Router configuration
├── routeTree.gen.ts        # Auto-generated routes
└── styles.css              # Global styles
```

### Data Flow Patterns

#### Pattern 1: TanStack Query (Client-Side)

```
Component → useQuery → API Route → Response
         ← Cache ← Response ← JSON
```

#### Pattern 2: Server Functions (RPC)

```
Component → createServerFn → Server Logic → File System
         ← Type-safe Response ← Execution ← Node.js
```

#### Pattern 3: Route Loaders (SSR)

```
Route → loader → Data Fetch → SSR
     ← useLoaderData ← Serialized ← HTML
```

---

## 🔑 Key Concepts

### TanStack Query

TanStack Query manages server state in your React application:

#### Basic Query

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/api/todos').then((res) => res.json()),
  initialData: [],
})
```

#### Mutations

```tsx
const { mutate } = useMutation({
  mutationFn: (newTodo: string) =>
    fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

**Key Features:**

- Automatic background refetching
- Caching and cache invalidation
- Request deduplication
- Optimistic updates
- DevTools integration

### TanStack Start Server Functions

Server functions provide type-safe RPC between client and server:

```tsx
// Server-side function
const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await readFromDatabase()
})

// Client-side usage
const todos = await getTodos()
```

**Key Features:**

- Full TypeScript type safety
- No manual API routes needed
- Input validation with `.inputValidator()`
- Middleware support
- Secure by default

### Route-Based Code Splitting

Each route is automatically code-split:

```tsx
export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
  // Optional: preload data
  loader: async () => await fetchData(),
})
```

### Rendering Modes

Choose the right mode per route:

```tsx
// Full SSR (default)
export const Route = createFileRoute('/ssr')({
  component: Component,
  loader: async () => data, // Runs on server
})

// SPA Mode
export const Route = createFileRoute('/spa')({
  ssr: false, // Client-only
  component: Component,
})
```

---

## 💻 Development

### Scripts

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production
npm run preview   # Preview production build
npm test          # Run tests with Vitest
npm run lint      # Lint code with ESLint
npm run format    # Format code with Prettier
npm run check     # Format and lint in one command
```

### Testing

This project uses [Vitest](https://vitest.dev/) for testing:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people',
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json() as Promise<{
      results: {
        name: string
      }[]
    }>
  },
  component: () => {
    const data = peopleRoute.useLoaderData()
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    )
  },
})
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ...

const queryClient = new QueryClient()

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
})
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from '@tanstack/react-query'

import './App.css'

function App() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      fetch('https://swapi.dev/api/people')
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  })

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

function App() {
  const count = useStore(countStore)
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  )
}

export default App
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store, Derived } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
doubledStore.mount()

function App() {
  const count = useStore(countStore)
  const doubledCount = useStore(doubledStore)

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  )
}

export default App
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
