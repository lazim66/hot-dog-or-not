# 🌭 Hot Dog or Not

> *"What would you say if I told you there is an app on the market..."*

Enterprise-grade hot dog detection powered by AI. Built with Next.js, OpenAI GPT-4o Vision, and Supabase.

## Features

- 🎯 **AI-Powered Analysis** - Uses GPT-4o Vision to detect hot dogs with confidence scores
- 📸 **Multiple Upload Methods** - Drag & drop, file selection, camera capture, or paste from clipboard
- 📊 **Analysis History** - Track all your analyses with session-based storage
- 📈 **Statistics Dashboard** - View detection breakdown with interactive charts
- ⌨️ **Keyboard Shortcuts** - Full keyboard navigation support

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Components** | shadcn/ui |
| **Styling** | Tailwind CSS v4 |
| **AI** | OpenAI GPT-4o Vision (via Vercel AI SDK) |
| **Database** | Supabase (Postgres) |
| **Storage** | Supabase Storage |
| **Validation** | Zod |
| **Deployment** | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hot-dog-or-not
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your values:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # OpenAI
   OPENAI_API_KEY=sk-...
   
   # Optional
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   
   Supabase database should have:
   - `analyses` table (see schema below)
   - `images` storage bucket with public access
   
   **Table: analyses**
   ```sql
   - id (UUID, PK)
   - image_url (TEXT)
   - image_path (TEXT)
   - is_hot_dog (BOOLEAN)
   - confidence (NUMERIC 5,2)
   - category (TEXT)
   - hot_dog_count (INTEGER)
   - style (TEXT, nullable)
   - reasoning (TEXT)
   - detected_items (JSONB)
   - session_id (TEXT)
   - created_at (TIMESTAMPTZ)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + O` | Open file picker |
| `Cmd/Ctrl + V` | Paste image from clipboard |
| `Esc` | Reset/Clear analysis |
| `?` | Show keyboard shortcuts |

## Project Structure

```
hot-dog-or-not/
├── app/
│   ├── page.tsx              # Main analysis page
│   ├── history/              # Analysis history page
│   ├── api/
│   │   ├── analyze/          # AI analysis endpoint
│   │   └── analyses/         # List/fetch analyses
│   └── globals.css           # Global styles + animations
├── components/
│   ├── ui/                   # shadcn components
│   ├── upload-zone.tsx       # Drag & drop upload
│   ├── analysis-result.tsx   # Result display
│   ├── analysis-card.tsx     # History card
│   ├── history-strip.tsx     # Recent analyses carousel
│   ├── sample-images.tsx     # Sample image carousel
│   └── stats-chart.tsx       # Statistics charts
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── ai/                   # AI schemas & logic
│   └── utils.ts              # Utilities + session management
└── types/
    └── index.ts              # TypeScript definitions
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This app is optimized for deployment on [Vercel](https://vercel.com):

## License

MIT

## Credits

Inspired by the legendary "Hot Dog or Not" app from HBO's Silicon Valley.
