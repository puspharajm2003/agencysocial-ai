# AgencySocial AI Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  Pages: Dashboard, Content Studio, Approvals, Client Portal │
├─────────────────────────────────────────────────────────────┤
│              API Client Layer (lib/api.ts)                   │
│   Handles requests, errors, retries, rate limiting          │
├─────────────────────────────────────────────────────────────┤
│                Backend API (Node.js/NestJS)                 │
│   Endpoints: /drafts, /approvals, /notifications, etc.     │
├─────────────────────────────────────────────────────────────┤
│                Prisma ORM + PostgreSQL                       │
│  Tables: Organization, User, Client, PostDraft, etc.       │
├─────────────────────────────────────────────────────────────┤
│   External Services (OAuth, AI, Storage, Billing)           │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Page Structure
```
client/src/
├── pages/
│   ├── dashboard.tsx          # Agency overview
│   ├── content-studio.tsx     # AI generation
│   ├── draft-editor.tsx       # Post lifecycle
│   ├── approvals.tsx          # Approval workflow
│   ├── client-portal.tsx      # Client dashboard
│   └── ...
├── components/
│   ├── layout/                # App layout & sidebar
│   ├── ui/                    # Base components (shadcn)
│   ├── ErrorBoundary.tsx      # Error handling
│   └── LoadingSkeletons.tsx   # Loading states
├── hooks/
│   └── useNotifications.ts    # Notification system
├── lib/
│   ├── api.ts                 # API client layer
│   ├── queryClient.ts         # React Query setup
│   └── utils.ts               # Utilities
└── App.tsx                    # Route setup
```

### Data Flow

```
User Action (click button)
    ↓
Event Handler (e.g., handleSaveDraft)
    ↓
API Client Call (api.drafts.saveDraft)
    ↓
API Response (success | error)
    ↓
Update State (setDraft)
    ↓
Toast Notification (success/error)
    ↓
Re-render UI
```

## Backend Architecture (Reference from Prisma Schema)

### Database Models
```
Organization (top-level tenant)
  ├── Users (with roles)
  ├── Clients (sub-tenants)
  │   ├── SocialAccounts (OAuth tokens)
  │   ├── PostDrafts (content)
  │   │   ├── ApprovalLogs (workflow)
  │   │   └── Assets (media)
  │   └── AnalyticsSnapshots
  └── Templates
```

### API Endpoints Pattern

```
/api
├── /drafts
│   ├── POST     (create)
│   ├── GET      (list)
│   ├── GET/:id  (detail)
│   ├── PATCH/:id (update)
│   └── DELETE/:id
│
├── /approvals
│   ├── GET      (queue)
│   ├── POST/:id/approve
│   ├── POST/:id/reject
│   └── POST/:id/comment
│
├── /notifications
│   ├── GET      (list)
│   ├── POST/:id/read
│   └── WS       (WebSocket)
│
└── /clients/:id
    ├── GET
    ├── GET/schedule
    └── GET/approvals
```

## State Management

### Frontend State
- **React State**: Form data, UI toggles, modals
- **React Query**: API cache, refetching
- **localStorage**: Authentication tokens, user preferences
- **Context**: (optional) Theme, auth user info

### Backend State
- **PostgreSQL**: Primary data store
- **Redis**: Cache, sessions, queue (BullMQ)
- **S3/Storage**: Media files

## Error Handling Strategy

```
Request → API Client
    ↓
Response OK?
    ├─ Yes → Parse & Return
    └─ No  → Check Status Code
        ├─ 400 → Validation error → toast.error()
        ├─ 401 → Auth error → redirect /login
        ├─ 403 → Permission error → toast.error()
        ├─ 404 → Not found → 404 page
        ├─ 500 → Server error → toast.error()
        └─ Network → Retry with backoff
```

## Performance Optimizations

### Frontend
- **Code Splitting**: Each page is lazy-loaded
- **Memoization**: `useMemo`, `useCallback` for expensive calculations
- **Debouncing**: Search/filter inputs debounced
- **Caching**: React Query for API responses
- **Image Optimization**: Responsive images with Unsplash

### Backend
- **Database Indexes**: On `clientId`, `scheduledAt`, `status`
- **Pagination**: Large lists paginated (default 20 items)
- **Caching**: Redis for frequently accessed data
- **Query Optimization**: Avoid N+1 queries with joins

## Security Architecture

### Frontend
- ✅ JWT tokens stored securely (httpOnly cookies ideal)
- ✅ CSRF protection via SameSite cookies
- ✅ XSS prevention via React's built-in escaping
- ✅ Input validation with Zod schemas

### Backend
- ✅ JWT validation on all protected routes
- ✅ Row-level security (verify `organizationId`, `clientId`)
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting per IP/user
- ✅ OAuth token encryption at rest

## Scaling Considerations

### Horizontal Scaling
```
Load Balancer
    ├── Backend Server 1
    ├── Backend Server 2
    └── Backend Server 3
         ↓
    Shared PostgreSQL (read replicas)
    Shared Redis (sessions)
    Shared S3 (media)
```

### Queue Processing
```
User Action → API → Enqueue Job → BullMQ → Worker → Social API
                                     ↓
                              Background Job Queue
```

### Real-Time Updates
```
WebSocket Server (Socket.IO or native WS)
    ├── Notification Channel
    ├── Approval Channel
    └── Analytics Channel
```

## Monitoring & Observability

### Metrics to Track
- API response time (p50, p95, p99)
- Error rate by endpoint
- Database query time
- WebSocket connection count
- Post publish success rate

### Logging
- **Application logs**: Sentry, LogRocket
- **Database logs**: Query duration, slow queries
- **API logs**: Request/response times, errors

### Alerting
- High error rate (> 5%)
- API latency spike (> 1s)
- Database connection pool exhausted
- WebSocket connection drop

## Deployment Architecture

### Development
```
Frontend: npm run dev (localhost:5173)
Backend: npm run dev (localhost:3000)
Database: Docker PostgreSQL
```

### Staging
```
Frontend: Vercel (staging branch)
Backend: Render/Railway (staging environment)
Database: Managed PostgreSQL
```

### Production
```
Frontend: Vercel CDN (global distribution)
Backend: Kubernetes/ECS (auto-scaling)
Database: AWS RDS Multi-AZ
Cache: AWS ElastiCache
Storage: AWS S3
```

## Technology Justification

| Technology | Why | Tradeoff |
|-----------|-----|----------|
| React + Vite | Fast, modern, great DX | Requires build step |
| TypeScript | Type safety, IDE support | Compilation overhead |
| Tailwind | Rapid UI development | Larger CSS bundle |
| shadcn/ui | Beautiful components, customizable | Not fully headless |
| wouter | Lightweight routing | Less features than Next.js |
| Prisma | Type-safe DB queries | Learning curve |
| PostgreSQL | Robust, relational data | ACID overhead |
| JWT | Stateless, scalable | Can't revoke mid-request |
| React Query | Excellent caching | Adds dependency |

---

**Last Updated**: Nov 2025  
**Version**: 1.0 (MVP)
