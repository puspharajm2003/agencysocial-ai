# Backend Setup & API Integration

## 🚀 Quick Start

### Step 1: Verify Backend is Running
Your backend should be running on the API URL specified in `.env.development`:

```bash
# Development (with mocks - no backend required)
VITE_USE_MOCKS=true  # Default
npm run dev

# Or with real backend
VITE_USE_MOCKS=false
VITE_API_URL=http://localhost:3000/api
npm run dev
```

### Step 2: Check Current Configuration
Open browser console and run:
```javascript
import { getAPIConfig } from '@/lib/api';
getAPIConfig();
// Output: { apiUrl: "...", useMocks: true|false, ... }
```

---

## 🔧 Switching Between Mock & Real API

### Using Mocks (Development)
```bash
# .env.development already has this
VITE_USE_MOCKS=true
npm run dev
```
✅ Works without backend  
✅ Fast iteration  
❌ No real data

### Using Real Backend
```bash
# Start backend first (must be running on port 3000)
cd ../server && npm run dev

# Then start frontend with real API
VITE_USE_MOCKS=false npm run dev
```
✅ Real data from database  
✅ Production-like  
❌ Requires backend

---

## 📋 Required Backend Endpoints

Your backend MUST implement these endpoints:

### Drafts API
```
POST   /api/drafts                  - Create draft
GET    /api/drafts/:id              - Get draft
POST   /api/drafts/:id/schedule     - Schedule post
POST   /api/drafts/:id/approve      - Submit for approval
PATCH  /api/drafts/:id              - Update draft
DELETE /api/drafts/:id              - Delete draft
GET    /api/drafts?limit=20         - List drafts
```

### Approvals API
```
GET    /api/approvals               - Get approval queue
POST   /api/approvals/:id/approve   - Approve post
POST   /api/approvals/:id/reject    - Reject post
POST   /api/approvals/:id/comment   - Add comment
```

### Notifications API
```
GET    /api/notifications?limit=10  - Get notifications
POST   /api/notifications/:id/read  - Mark as read
POST   /api/notifications/subscribe - Subscribe to updates
WS     /ws/notifications            - WebSocket channel
```

### Clients API
```
GET    /api/clients/:id/schedule    - Get scheduled posts
GET    /api/clients/:id/approvals   - Get approval status
```

---

## 📦 Response Format

All endpoints must return this format:

**Success Response (200)**
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message"
}
```

**Error Response (400+)**
```json
{
  "success": false,
  "error": "Error description",
  "message": null,
  "data": null
}
```

---

## 🔐 Authentication

Frontend automatically includes JWT token from localStorage:

```typescript
// Header automatically added for all requests:
{
  "Authorization": "Bearer <token_from_localStorage>"
}
```

To login:
```typescript
// Save token after successful login
localStorage.setItem("authToken", response.token);
```

---

## ❌ Error Handling

The API client handles these errors:

| Error | Status | Action |
|-------|--------|--------|
| Network error | 0 | Show "Backend not running" |
| Validation error | 400 | Show error message from server |
| Auth error | 401 | Redirect to login |
| Permission error | 403 | Show "Access denied" |
| Not found | 404 | Show 404 page |
| Server error | 500 | Show "Server error" + retry button |
| Timeout | N/A | Retry up to 3 times |

---

## 🧪 Testing the Integration

### Test 1: Mock API (No Backend)
```bash
VITE_USE_MOCKS=true npm run dev
# Visit http://localhost:5173/draft/1
# Click "Save Draft" - should show toast notification
# Works because mockAPI is used
```

### Test 2: Real API (With Backend)
```bash
# Terminal 1: Start backend
cd ../server && npm run dev
# Backend should be on http://localhost:3000/api

# Terminal 2: Start frontend
VITE_USE_MOCKS=false npm run dev

# Test endpoints
# Visit http://localhost:5173/draft/1
# Click "Save Draft" - makes real API call to http://localhost:3000/api/drafts
```

### Test 3: Network Errors
```bash
# Frontend on, Backend off
VITE_USE_MOCKS=false npm run dev
# Try to save draft
# Should show error: "Network error - is your backend running?"
```

---

## 🔄 How the API Layer Works

```
User Action
    ↓
Component calls: api.drafts.saveDraft()
    ↓
Check: USE_MOCKS flag
    ├─ true  → mockAPI.drafts.saveDraft() (instant, no network)
    └─ false → productionAPI.drafts.saveDraft() (real fetch to backend)
    ↓
Handle Response
    ├─ Success (200) → Return data
    └─ Error (400+)  → Throw APIError
    ↓
Component catches error
    ├─ Success → Show toast
    └─ Error   → Show error toast + log
```

---

## 🛠️ Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:3000` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `10000` |
| `VITE_USE_MOCKS` | Use mock data | `true` |

### Setting for Production
```bash
# In .env.production
VITE_API_URL=https://your-api.com/api
VITE_WS_URL=wss://your-api.com
VITE_USE_MOCKS=false
```

---

## 🚨 Common Issues

### "Network error - is your backend running?"
- Backend is not running on the configured API_URL
- Check `VITE_API_URL` environment variable
- Verify backend is accessible: `curl http://localhost:3000/api/health`

### "401 Unauthorized"
- JWT token is missing or expired
- Check: `localStorage.getItem("authToken")`
- Try logging out and back in

### "CORS error"
- Backend CORS headers not configured
- Add to backend:
  ```
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Credentials: true
  ```

### Timeout errors
- API taking > 10s to respond
- Increase `VITE_API_TIMEOUT` in .env
- Check database query performance

---

## 📚 Code Examples

### Using the API in a Component
```typescript
import { api, APIError } from "@/lib/api";
import { toast } from "sonner";

export function MyComponent() {
  const handleSave = async () => {
    try {
      const response = await api.drafts.saveDraft({
        title: "My Post",
        caption: "Hello world"
      });
      
      if (response.success) {
        toast.success(response.message);
        console.log("Saved:", response.data);
      }
    } catch (error) {
      if (error instanceof APIError) {
        toast.error(error.message);
      }
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Checking API Configuration
```typescript
import { getAPIConfig } from "@/lib/api";

const config = getAPIConfig();
console.log("Using mocks?", config.useMocks);
console.log("API URL:", config.apiUrl);
```

---

## 🎯 Next Steps

1. ✅ Frontend API layer set up (you are here)
2. ⏳ Implement backend endpoints
3. ⏳ Test with real database
4. ⏳ Set up authentication
5. ⏳ Deploy to production

---

## 📞 Support

For issues:
1. Check browser console for detailed error logs
2. Verify backend is running: `curl http://localhost:3000/api/health`
3. Check `VITE_USE_MOCKS` flag matches your setup
4. Review endpoint responses match the required format
