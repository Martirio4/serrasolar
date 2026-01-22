# Solar Service Manager

A professional demo-grade SaaS web application for managing solar service operations. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: KPI cards, recent activity feed
- **Installations Management**: View, create, and manage solar installations
- **Ticket System**: Create, track, and resolve service tickets
- **Technician Management**: View technician assignments and workload
- **Role-Based Access**: Demo login with Admin, Dispatcher, and Technician roles
- **Responsive Design**: Mobile-first, optimized for desktop
- **Mock Backend**: Production-ready architecture with mock repositories (ready for Firebase integration)

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Server Components + Client Components
- **Architecture**: Repository pattern with mock implementations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd serrasolar
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
serrasolar/
├── app/                    # Next.js App Router pages
│   ├── installations/      # Installation pages
│   ├── tickets/           # Ticket pages
│   ├── technicians/       # Technician pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components (TopBar, Sidebar, etc.)
├── domain/                # Domain types and repository interfaces
├── data/                  # Mock repositories and seed data
├── lib/                   # Utility functions
└── public/                # Static assets
```

## Architecture

### Domain Layer (`/domain`)
- Type definitions for all entities (Installation, Ticket, Technician)
- Repository interfaces defining data access contracts

### Data Layer (`/data`)
- Mock repository implementations
- Seed data for demo purposes
- **TODO**: Replace with Firebase implementations

### Component System (`/components`)
- **UI Components**: Button, Card, Input, Select, Badge, Table, etc.
- **Layout Components**: TopBar, Sidebar, MobileNav
- All components follow design system guidelines

## Design System

### Colors
- **Primary**: Turquesa (#14B8A6) - Usado para CTAs y destacados
- **Status Colors**:
  - Green: Active/Resolved
  - Yellow/Orange: In Progress/Warning
  - Red: High Priority/Failure
- **Neutrals**: Gray scale for UI elements

### Typography
- System font stack (Inter-like)
- H1: 28-32px, semibold
- H2: 20-24px
- H3: 16-18px
- Body: 14-16px

### Spacing
- Consistent scale: 4 / 8 / 12 / 16 / 24 / 32px
- Max content width: 1200px
- 12-column grid on desktop

## Demo Login

The app includes a role selector in the top bar:
- **Admin**: Full access to all features
- **Dispatcher**: Can manage tickets and installations
- **Technician**: Can view assigned items and update ticket status

Role is persisted in localStorage for the demo.

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in [Vercel](https://vercel.com):
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

3. Deploy:
   - Vercel will automatically build and deploy
   - Your app will be available at `your-project.vercel.app`

### Environment Variables

No environment variables are required for the mock backend. When integrating Firebase, you'll need to add:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- etc.

## Future Firebase Integration

The codebase is structured to easily replace mock repositories with Firebase:

1. **Replace Repository Implementations** (`/data/repositories.ts`):
   - Implement Firebase Firestore queries
   - Replace in-memory arrays with Firestore collections
   - Add real-time listeners where needed

2. **Authentication** (`/lib/auth.ts`):
   - Replace localStorage with Firebase Auth
   - Implement proper user management
   - Add authentication guards

3. **Real-time Updates**:
   - Add Firestore listeners for live data
   - Implement optimistic UI updates
   - Add offline support

### Key Integration Points

- `domain/repositories.ts` - Interface definitions (keep as-is)
- `data/repositories.ts` - Replace implementations with Firebase
- `lib/auth.ts` - Replace with Firebase Auth
- `data/seed.ts` - Can be used for initial Firestore seeding

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Components use functional components with TypeScript
- Server Components by default, Client Components when needed

## License

This is a demo application for showcase purposes.
