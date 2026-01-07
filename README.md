# Ringing Stats UI

A modern Next.js frontend application for the bellboard tower scraper, providing an intuitive interface for uploading tower data, matching with Dove's Guide, and viewing parsed performances.

## Features

- 🎯 **CSV Upload**: Drag-and-drop interface for uploading tower data
- 🔍 **Tower Matching**: Intelligent matching with Dove's Guide database
- 📊 **Performance Tracking**: View and filter parsed performance data
- 💾 **Auto-save**: Automatic caching of tower selections
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- ⚡ **Real-time**: Powered by React Query for efficient data management

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible UI components
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to the bellboard-tower-scraper backend API

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KateR-S/ringing-stats-ui.git
cd ringing-stats-ui
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
ringing-stats-ui/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Main upload page
│   ├── towers/
│   │   └── page.tsx             # Tower selection/editing
│   ├── performances/
│   │   └── page.tsx             # Performances table
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── alert.tsx
│   ├── file-upload.tsx          # File upload component
│   ├── dove-search-select.tsx   # Dove matching component
│   └── providers.tsx            # React Query provider
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── .env.example                 # Environment template
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## Usage

### 1. Upload Tower Data

1. Navigate to the home page
2. Upload a CSV file with required columns:
   - `bells_type` - Type of bells
   - `place` - Location name
   - `address` - Full address
   - `region` - Geographic region
   - `tenor` - Tenor weight

3. The file is automatically sent to the backend for deduplication

### 2. Match Towers

1. After upload, you're redirected to the Towers page
2. For each tower:
   - Edit the search query if needed
   - Click "Search" to find Dove matches
   - Select the best matching tower from the dropdown
   - If score < 90, a warning appears - click "Checked OK" to dismiss
3. All selections are automatically saved

### 3. View Performances

1. Navigate to the Performances page
2. Upload a performances CSV file
3. View parsed data in the table
4. Use the search box to filter results

## API Integration

The application communicates with the FastAPI backend at `KateR-S/bellboard-tower-scraper`.

### Endpoints Used

- `POST /api/towers/deduplicate` - Upload and deduplicate towers
- `POST /api/towers/dove-lookup` - Search Dove's Guide
- `GET /api/cache/user` - Load cached selections
- `POST /api/cache/user` - Save tower selections
- `POST /api/performances/parse` - Parse performance data

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
4. Deploy!

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:

- **Netlify**: Use the Netlify CLI or Git integration
- **Railway**: Connect your GitHub repo
- **DigitalOcean App Platform**: Deploy from GitHub

## Development Workflow

1. **Make changes**: Edit files in `app/`, `components/`, or `lib/`
2. **Hot reload**: Changes appear instantly in development mode
3. **Type check**: TypeScript provides real-time error checking
4. **Build**: Run `npm run build` to check for production issues
5. **Lint**: Run `npm run lint` to check code quality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

ISC

## Acknowledgments

- Backend API: [bellboard-tower-scraper](https://github.com/KateR-S/bellboard-tower-scraper)
- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
