# 🌍 Traveloop — Frontend

Personalized travel planning web application built for the **Odoo Hackathon 2026**.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with server-side rendering |
| TypeScript (strict) | Type safety across the entire codebase |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Accessible, customizable UI components |
| TanStack React Query | Server state management & caching |
| React Hook Form + Zod | Form handling with schema validation |
| Recharts | Data visualization (charts) |
| @dnd-kit | Drag-and-drop itinerary builder |
| Lucide React | Icon library |
| date-fns | Date formatting |

---

## Getting Started

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs on port 3000.

### Demo Credentials (Mock Mode)
- **Email:** `demo@traveloop.com`
- **Password:** `password123`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_USE_MOCK` | Use mock data instead of real API | `true` |

---

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Register (no sidebar)
│   ├── (main)/             # Dashboard, Trips, Profile, Search, Community
│   │   ├── dashboard/
│   │   ├── trips/
│   │   │   ├── [id]/       # Trip detail
│   │   │   │   ├── build/  # Itinerary builder (drag-and-drop)
│   │   │   │   ├── notes/  # Trip notes
│   │   │   │   └── invoice/ # Expense invoice
│   │   │   └── create/     # New trip form
│   │   ├── search/         # Explore destinations
│   │   ├── community/      # Social feed
│   │   └── profile/        # User profile
│   └── admin/              # Admin analytics (admin-only)
├── components/             # Reusable UI components
│   ├── shared/             # Layout components (Navbar, Sidebar, etc.)
│   ├── trips/              # Trip-specific components
│   ├── admin/              # Admin dashboard charts
│   └── ui/                 # shadcn/ui base components
├── hooks/                  # Custom React hooks (TanStack Query wrappers)
├── lib/
│   ├── api/                # API layer (mock ↔ real switch)
│   └── mock/               # Mock data services
├── types/                  # TypeScript type definitions
└── middleware.ts            # Route protection
```

---

## 🔌 Backend Integration Guide (For Backend Team)

### Overview

The frontend is designed with a **clean API abstraction layer**. All data fetching goes through files in `/lib/api/`. Each API file has a mock implementation and a real implementation — controlled by a single env variable.

**To switch from mock to real backend:**

```env
# In .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api   # Your Django/backend URL
NEXT_PUBLIC_USE_MOCK=false                       # ← Change this to false
```

**Zero component code changes needed.** The hooks and pages stay the same.

---

### Architecture: How It Works

```
Page Component
     ↓ calls
Custom Hook (e.g. useTrips)
     ↓ calls
API Service (e.g. trips.api.ts)
     ↓ checks env
  ┌──────────────┐
  │ USE_MOCK=true │ → Mock data (lib/mock/*.mock.ts)
  │ USE_MOCK=false│ → Real API (fetch to your backend)
  └──────────────┘
```

Each API file in `/lib/api/` follows this pattern:

```typescript
// lib/api/trips.api.ts
import { mockTrips } from "@/lib/mock/trips.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const tripsApi = {
  getAll: async () => {
    if (USE_MOCK) return mockTrips.getAll();
    const res = await fetch(`${API_URL}/trips`, { headers: getAuthHeaders() });
    return res.json();
  },
  // ...
};
```

---

### API Endpoints Required

Below is the full list of endpoints the frontend expects. Implement these on your backend.

#### Authentication

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, user: { id, email, firstName, lastName, role } }` |
| `POST` | `/api/auth/register` | `{ email, password, firstName, lastName }` | `{ token, user }` |
| `GET` | `/api/auth/me` | — | `{ user }` |

#### Trips

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips` | List all trips for current user |
| `GET` | `/api/trips/:id` | Get single trip details |
| `POST` | `/api/trips` | Create new trip |
| `PUT` | `/api/trips/:id` | Update trip |
| `DELETE` | `/api/trips/:id` | Delete trip |

**Trip object shape:**
```typescript
{
  id: string;
  name: string;
  destination: string;
  country: string;
  startDate: string;       // ISO date
  endDate: string;         // ISO date
  status: "upcoming" | "ongoing" | "completed";
  stops: number;
  budget: number;
  coverImage: string;      // URL
  createdAt: string;
}
```

#### Itinerary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips/:id/itinerary` | Get itinerary sections + activities |
| `PUT` | `/api/trips/:id/itinerary` | Update/save itinerary |

**Itinerary object shape:**
```typescript
{
  tripId: string;
  sections: [{
    id: string;
    title: string;          // Stop name (e.g. "Ubud, Bali")
    description: string;
    startDate: string;
    endDate: string;
    budget: number;
    activities: [{
      id: string;
      name: string;
      day: number;
      time: string;
      duration: string;
      category: "transport" | "stay" | "food" | "activities" | "shopping" | "other";
      expense: number;
      notes: string;
    }]
  }]
}
```

#### Budget

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips/:id/budget` | Budget summary + category breakdown |

#### Checklist

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips/:id/checklist` | Get checklist items |
| `POST` | `/api/trips/:id/checklist` | Add checklist item |
| `PUT` | `/api/trips/:id/checklist/:itemId` | Toggle / update item |
| `DELETE` | `/api/trips/:id/checklist/:itemId` | Delete item |

#### Notes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips/:id/notes` | Get all notes for a trip |
| `POST` | `/api/trips/:id/notes` | Create a note |
| `PUT` | `/api/trips/:id/notes/:noteId` | Update a note |
| `DELETE` | `/api/trips/:id/notes/:noteId` | Delete a note |

#### Search / Explore

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/destinations?q=...` | Search cities |
| `GET` | `/api/activities?q=...` | Search activities |

#### Community

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/community/posts` | List community posts |
| `POST` | `/api/community/posts` | Create a post |
| `POST` | `/api/community/posts/:id/like` | Toggle like |

#### Admin (admin role only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard KPIs + chart data |
| `GET` | `/api/admin/users` | List all users |

---

### Response Format

All API responses should follow this format:

```json
{
  "data": { ... },
  "success": true,
  "message": "optional message"
}
```

For errors:
```json
{
  "data": null,
  "success": false,
  "message": "Error description"
}
```

---

### Authentication

- The frontend sends a **JWT token** in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```
- The token is stored in `localStorage` under the key `auth_token`
- On login/register, the backend must return a `token` field in the response

---

### CORS Configuration

Your backend **must** enable CORS for the frontend origin:

```python
# Django example (django-cors-headers)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

---

### Step-by-Step Integration Checklist

1. **Set up your backend** with Django REST Framework (or your chosen framework)
2. **Implement the endpoints** listed above
3. **Enable CORS** for `localhost:3000`
4. **Return JWT tokens** on login/register
5. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_USE_MOCK=false
   ```
6. **Restart the frontend** — `npm run dev`
7. **Test** — login and navigate through the app

---

### Type Definitions

All TypeScript types are in the `/types/` directory. These define the exact shape of data the frontend expects:

| File | Contents |
|---|---|
| `trips.types.ts` | Trip, CreateTripPayload |
| `itinerary.types.ts` | Itinerary, Section, Activity |
| `budget.types.ts` | BudgetSummary, CategoryBreakdown |
| `checklist.types.ts` | ChecklistItem |
| `notes.types.ts` | TripNote |
| `community.types.ts` | CommunityPost |
| `user.types.ts` | User |
| `api.types.ts` | AdminStats, ApiResponse |

**Use these as your API contract.** As long as your backend returns data matching these types, everything will work.

---

## Security Features

- Content Security Policy (CSP) headers
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY (clickjacking protection)
- X-Content-Type-Options: nosniff
- Input validation via Zod schemas
- Route protection middleware
- JWT token management
- XSS prevention via React's built-in escaping

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Team

- **Frontend:** Next.js 16 + TypeScript
- **Backend:** Django REST Framework (separate repo/branch)

## License

Hackathon project — Odoo Hackathon 2026
