# Backend Integration Guide

## Overview
This document explains how to connect the **AgencySocial AI** frontend to your Prisma database backend.

## Architecture Pattern

The frontend uses a centralized API client layer (`lib/api.ts`) that:
1. **Defines all request/response types** (TypeScript interfaces)
2. **Provides mock implementations** for development
3. **Can be swapped with real `fetch` calls** when backend is ready

## Quick Integration Steps

### 1. Set Up Environment Variables

Create `.env.local` in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

### 2. Create Real API Client

Replace the mock implementation in `lib/api.ts`:

```typescript
// lib/api.ts - BEFORE (mock)
async saveDraft(draft: Partial<PostDraftResponse>) {
  await delay(500);
  return { success: true, data: { ...draft, id: draft.id || "draft_" + Date.now() } };
}

// AFTER (real backend call)
async saveDraft(draft: Partial<PostDraftResponse>) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/drafts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft)
  });
  if (!response.ok) throw new Error(`Failed to save draft: ${response.statusText}`);
  return response.json();
}
```

### 3. Backend Endpoints Required

Your backend needs to implement these endpoints (based on Prisma schema):

#### Drafts API
```
POST   /api/drafts              - Create/save draft
GET    /api/drafts/:id          - Get draft details
PATCH  /api/drafts/:id          - Update draft
POST   /api/drafts/:id/schedule - Schedule post
POST   /api/drafts/:id/approve  - Submit for approval
DELETE /api/drafts/:id          - Delete draft
GET    /api/drafts?clientId=X   - List drafts by client
```

#### Approvals API
```
GET    /api/approvals           - Get approval queue
POST   /api/approvals/:id/approve - Approve post
POST   /api/approvals/:id/reject  - Reject post
POST   /api/approvals/:id/comment - Add comment
```

#### Notifications API
```
GET    /api/notifications       - Get notifications
POST   /api/notifications/:id/read - Mark as read
WS     /ws/notifications       - WebSocket for real-time
```

#### Client Portal API
```
GET    /api/clients/:id/schedule - Get scheduled posts
GET    /api/clients/:id/approvals - Get approval status
GET    /api/clients/:id/activity - Get activity feed
```

### 4. Response Format

All endpoints should return this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "error": null
}
```

Errors:
```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": "Error description"
}
```

### 5. Authentication

Add JWT token to all requests:

```typescript
// In api.ts, create a helper:
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

// Use in all fetch calls:
const response = await fetch(url, {
  method: "POST",
  headers: getHeaders(),
  body: JSON.stringify(data)
});
```

### 6. Error Handling

The frontend has built-in error handling:

```typescript
try {
  const response = await api.drafts.saveDraft(draft);
  if (response.success) {
    toast.success(response.message);
  }
} catch (error) {
  toast.error("Failed to save draft");
  console.error(error);
}
```

### 7. Real-Time Notifications (WebSocket)

For real-time updates, upgrade notifications:

```typescript
// In useNotifications.ts
useEffect(() => {
  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/notifications`);
  
  ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    showNotification(notification);
  };
  
  return () => ws.close();
}, []);
```

### 8. Testing the Integration

1. Start your backend on `http://localhost:3000`
2. Update `VITE_API_URL` in `.env.local`
3. Swap mock implementations in `lib/api.ts` with real fetch calls
4. Test each page:
   - `/draft/:id` - Save, schedule, approve
   - `/approvals` - Approve/reject posts
   - `/client-portal` - View scheduled posts

### 9. Data Types from Prisma Schema

Reference these Prisma models in your API:

```prisma
model PostDraft {
  id              String
  title           String?
  caption         String
  mediaUrls       String[]
  platform        Platform
  status          PostStatus
  scheduledAt     DateTime?
  clientId        String
  createdById     String
  approvalLogs    ApprovalLog[]
}

model ApprovalLog {
  id          String
  postDraftId String
  userId      String
  action      String  // "REQUESTED", "APPROVED", "REJECTED"
  comment     String?
  createdAt   DateTime
}

model Client {
  id          String
  name        String
  brandVoice  Json?
  posts       PostDraft[]
}
```

## Production Checklist

- [ ] Replace all mock API calls with real fetch
- [ ] Add error boundaries around data-fetching components
- [ ] Implement proper retry logic with exponential backoff
- [ ] Add loading skeletons/spinners to all pages
- [ ] Set up request timeout handling
- [ ] Add CORS headers on backend
- [ ] Implement request throttling/debouncing
- [ ] Test with real database queries
- [ ] Monitor API latency/errors
- [ ] Add logging for debugging

## Performance Optimization

- Use React Query for caching/refetching
- Debounce rapid API calls
- Batch requests when possible
- Implement pagination for large lists
- Cache user preferences locally

---

**Need help?** Check `client/src/lib/api.ts` for the full API client interface.
