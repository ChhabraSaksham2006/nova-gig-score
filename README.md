# Nova Gig Score

A modern React application built with TypeScript and Vite for calculating and managing gig scores.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd nova-gig-score
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technology Stack

This project is built with:

- **Vite** - Fast build tool and development server
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **React Hook Form** - Form handling
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Static assets
```

## Development

### Code Style

This project uses ESLint for code linting. Run `npm run lint` to check for issues.

### Building

To build the project for production:

```sh
npm run build
```

The built files will be in the `dist` directory.

## Deployment

You can deploy this application to any static hosting service like:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Simply build the project and upload the `dist` folder contents.
