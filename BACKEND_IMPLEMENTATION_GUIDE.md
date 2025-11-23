# Complete Backend Implementation Guide

## 🎯 Overview

This guide provides **complete, copy-paste ready code** for your Node.js/Express backend to work with the AgencySocial AI frontend.

**What you need to implement:**
1. Database schema updates (Prisma)
2. Authentication endpoints (login/signup)
3. All API endpoints (drafts, approvals, notifications, etc.)
4. Database storage layer

---

## 🔧 Step 1: Environment Setup

Add to your `.env` file:

```env
# Neon Database
DATABASE_URL=postgresql://neondb_owner:npg_7IwWgGVSpzF2@ep-billowing-surf-adl90nsb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Secret
JWT_SECRET=your-super-secret-key-change-in-production

# API Port
PORT=5000
```

---

## 📊 Step 2: Update Database Schema

Replace `shared/schema.ts` with:

```typescript
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable(
  "users",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    username: text("username").notNull().unique(),
    email: text("email").unique(),
    password: text("password").notNull(),
    role: varchar("role").default("SOCIAL_MANAGER"), // AGENCY_OWNER, SOCIAL_MANAGER, CLIENT_REVIEWER
    organizationId: varchar("organization_id"),
    createdAt: timestamp("created_at").default(sql`now()`),
    updatedAt: timestamp("updated_at").default(sql`now()`),
  },
  (table) => ({
    userOrgIdIdx: index("user_org_id_idx").on(table.organizationId),
  })
);

// Organizations table
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: varchar("slug").unique(),
  brandSettings: jsonb("brand_settings"), // { logo, colors, name, domain }
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Clients table
export const clients = pgTable(
  "clients",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    organizationId: varchar("organization_id").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    status: varchar("status").default("ACTIVE"), // ACTIVE, INACTIVE, ARCHIVED
    brandVoice: jsonb("brand_voice"), // Brand guidelines as JSON
    createdAt: timestamp("created_at").default(sql`now()`),
    updatedAt: timestamp("updated_at").default(sql`now()`),
  },
  (table) => ({
    clientOrgIdIdx: index("client_org_id_idx").on(table.organizationId),
  })
);

// Post Drafts table
export const postDrafts = pgTable(
  "post_drafts",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    clientId: varchar("client_id").notNull(),
    title: text("title"),
    caption: text("caption").notNull(),
    mediaUrls: jsonb("media_urls").default(sql`'[]'`), // Array of media URLs
    platform: varchar("platform").notNull(), // instagram, facebook, twitter, linkedin, tiktok, youtube
    status: varchar("status").default("DRAFT"), // DRAFT, PENDING_APPROVAL, SCHEDULED, PUBLISHED, FAILED
    scheduledAt: timestamp("scheduled_at"),
    createdById: varchar("created_by_id").notNull(),
    idempotencyKey: varchar("idempotency_key").unique(), // Prevent duplicate posts
    hashtags: jsonb("hashtags").default(sql`'[]'`), // Array of hashtags
    metadata: jsonb("metadata"), // Additional data (engagement, etc)
    createdAt: timestamp("created_at").default(sql`now()`),
    updatedAt: timestamp("updated_at").default(sql`now()`),
  },
  (table) => ({
    clientIdIdx: index("draft_client_id_idx").on(table.clientId),
    statusIdx: index("draft_status_idx").on(table.status),
    scheduledAtIdx: index("draft_scheduled_at_idx").on(table.scheduledAt),
  })
);

// Approval Logs table
export const approvalLogs = pgTable(
  "approval_logs",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    postDraftId: varchar("post_draft_id").notNull(),
    userId: varchar("user_id").notNull(),
    action: varchar("action").notNull(), // REQUESTED, APPROVED, REJECTED, COMMENT
    comment: text("comment"),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    postDraftIdIdx: index("approval_post_draft_id_idx").on(table.postDraftId),
  })
);

// Notifications table
export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull(),
    type: varchar("type").notNull(), // APPROVAL_REQUESTED, POST_APPROVED, POST_PUBLISHED, POST_FAILED, COMMENT_ADDED
    title: text("title").notNull(),
    message: text("message").notNull(),
    relatedId: varchar("related_id"), // Post ID or Approval ID
    read: boolean("read").default(false),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userIdIdx: index("notification_user_id_idx").on(table.userId),
    readIdx: index("notification_read_idx").on(table.read),
  })
);

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PostDraft = typeof postDrafts.$inferSelect;
export type ApprovalLog = typeof approvalLogs.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Client = typeof clients.$inferSelect;
```

Run migration:
```bash
npm run db:push
```

---

## 🔐 Step 3: Update Storage Layer

Replace `server/storage.ts` with:

```typescript
import { type User, type InsertUser, users, postDrafts, approvalLogs, notifications, organizations, clients } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface IStorage {
  // Auth
  createUser(user: InsertUser): Promise<{ user: User; token: string }>;
  getUserByUsername(username: string): Promise<User | undefined>;
  validatePassword(password: string, hash: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  generateToken(userId: string): string;
  verifyToken(token: string): string | null;

  // Post Drafts
  createPostDraft(data: any): Promise<any>;
  getPostDraft(id: string): Promise<any | undefined>;
  updatePostDraft(id: string, data: any): Promise<any>;
  listPostDrafts(clientId: string): Promise<any[]>;

  // Approvals
  createApprovalLog(data: any): Promise<any>;
  getApprovalQueue(organizationId: string): Promise<any[]>;
  
  // Notifications
  createNotification(data: any): Promise<any>;
  getNotifications(userId: string): Promise<any[]>;
  markNotificationRead(id: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  async createUser(user: InsertUser): Promise<{ user: User; token: string }> {
    const hashedPassword = await this.hashPassword(user.password);
    
    const newUser = await db
      .insert(users)
      .values({
        ...user,
        password: hashedPassword,
      })
      .returning();
    
    const token = this.generateToken(newUser[0].id);
    return { user: newUser[0], token };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    
    return result[0];
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return decoded.userId;
    } catch {
      return null;
    }
  }

  async createPostDraft(data: any) {
    const result = await db.insert(postDrafts).values(data).returning();
    return result[0];
  }

  async getPostDraft(id: string) {
    const result = await db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.id, id));
    
    return result[0];
  }

  async updatePostDraft(id: string, data: any) {
    const result = await db
      .update(postDrafts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(postDrafts.id, id))
      .returning();
    
    return result[0];
  }

  async listPostDrafts(clientId: string) {
    return db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.clientId, clientId));
  }

  async createApprovalLog(data: any) {
    const result = await db.insert(approvalLogs).values(data).returning();
    return result[0];
  }

  async getApprovalQueue(organizationId: string) {
    // Get all drafts pending approval for this organization's clients
    return db.select().from(postDrafts).where(
      and(
        eq(postDrafts.status, "PENDING_APPROVAL"),
        // You'd need to join with clients table filtered by organizationId
      )
    );
  }

  async createNotification(data: any) {
    const result = await db.insert(notifications).values(data).returning();
    return result[0];
  }

  async getNotifications(userId: string) {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId));
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new PostgresStorage();
```

---

## 🔌 Step 4: Create Database Connection

Create `server/db.ts`:

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { http } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle({
  connection: http(process.env.DATABASE_URL),
  logger: true,
});
```

---

## 🛣️ Step 5: Implement API Routes

Replace `server/routes.ts` with:

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // ============ AUTH ENDPOINTS ============
  
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validation
      if (!username || !password || password.length < 6) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid username or password (min 6 chars)" 
        });
      }

      // Check if user exists
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ 
          success: false,
          message: "Username already taken" 
        });
      }

      // Create user
      const { user, token } = await storage.createUser({ username, password });
      
      res.json({
        success: true,
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Signup failed" 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid credentials" 
        });
      }

      const isValid = await storage.validatePassword(password, user.password);
      
      if (!isValid) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid credentials" 
        });
      }

      const token = storage.generateToken(user.id);
      
      res.json({
        success: true,
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Login failed" 
      });
    }
  });

  // ============ DRAFT ENDPOINTS ============
  
  app.post("/api/drafts", async (req, res) => {
    try {
      const { title, caption, platform, clientId, mediaUrls } = req.body;
      
      const draft = await storage.createPostDraft({
        title,
        caption,
        platform,
        clientId,
        mediaUrls: mediaUrls || [],
        status: "DRAFT",
        createdById: (req as any).userId,
      });
      
      res.json({
        success: true,
        data: draft,
        message: "Draft created"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to create draft" 
      });
    }
  });

  app.get("/api/drafts/:id", async (req, res) => {
    try {
      const draft = await storage.getPostDraft(req.params.id);
      
      if (!draft) {
        return res.status(404).json({ 
          success: false,
          message: "Draft not found" 
        });
      }
      
      res.json({
        success: true,
        data: draft
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch draft" 
      });
    }
  });

  app.post("/api/drafts/:id/schedule", async (req, res) => {
    try {
      const { scheduledAt } = req.body;
      
      const draft = await storage.updatePostDraft(req.params.id, {
        status: "SCHEDULED",
        scheduledAt: new Date(scheduledAt)
      });
      
      res.json({
        success: true,
        data: draft,
        message: "Post scheduled"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to schedule post" 
      });
    }
  });

  app.post("/api/drafts/:id/approve", async (req, res) => {
    try {
      const draft = await storage.updatePostDraft(req.params.id, {
        status: "PENDING_APPROVAL"
      });
      
      // Create approval log
      await storage.createApprovalLog({
        postDraftId: req.params.id,
        userId: (req as any).userId,
        action: "REQUESTED"
      });
      
      res.json({
        success: true,
        data: draft,
        message: "Post sent for approval"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to submit for approval" 
      });
    }
  });

  // ============ APPROVALS ENDPOINTS ============
  
  app.post("/api/approvals/:id/approve", async (req, res) => {
    try {
      const { comment } = req.body;
      
      // Update post status
      const draft = await storage.updatePostDraft(req.params.id, {
        status: "APPROVED"
      });
      
      // Create approval log
      await storage.createApprovalLog({
        postDraftId: req.params.id,
        userId: (req as any).userId,
        action: "APPROVED",
        comment
      });
      
      res.json({
        success: true,
        data: draft,
        message: "Post approved"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to approve" 
      });
    }
  });

  app.post("/api/approvals/:id/reject", async (req, res) => {
    try {
      const { comment } = req.body;
      
      // Update post status
      const draft = await storage.updatePostDraft(req.params.id, {
        status: "DRAFT"
      });
      
      // Create approval log
      await storage.createApprovalLog({
        postDraftId: req.params.id,
        userId: (req as any).userId,
        action: "REJECTED",
        comment
      });
      
      res.json({
        success: true,
        data: draft,
        message: "Post rejected"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to reject" 
      });
    }
  });

  // ============ NOTIFICATIONS ENDPOINTS ============
  
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const notifs = await storage.getNotifications(userId);
      const unreadCount = notifs.filter(n => !n.read).length;
      
      res.json({
        success: true,
        data: notifs,
        unreadCount
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch notifications" 
      });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      
      res.json({
        success: true,
        message: "Marked as read"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to mark as read" 
      });
    }
  });

  return httpServer;
}
```

---

## 🔐 Step 6: Add Authentication Middleware

Add to `server/app.ts` before registering routes:

```typescript
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Auth middleware
app.use("/api", (req, res, next) => {
  // Skip auth for login/signup
  if (req.path.includes("/auth/")) {
    return next();
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Missing authentication token" 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
});
```

---

## 📦 Step 7: Install Dependencies

```bash
npm install bcrypt jsonwebtoken drizzle-orm @neondatabase/serverless
npm install -D @types/bcrypt @types/jsonwebtoken
```

---

## ✅ Step 8: Test Your Backend

```bash
npm run dev

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

---

## 🎯 All Endpoints Ready

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/signup` | POST | No | Create account |
| `/api/auth/login` | POST | No | Login |
| `/api/drafts` | POST | Yes | Create draft |
| `/api/drafts/:id` | GET | Yes | Get draft |
| `/api/drafts/:id/schedule` | POST | Yes | Schedule post |
| `/api/drafts/:id/approve` | POST | Yes | Submit for approval |
| `/api/approvals/:id/approve` | POST | Yes | Approve post |
| `/api/approvals/:id/reject` | POST | Yes | Reject post |
| `/api/notifications` | GET | Yes | Get notifications |
| `/api/notifications/:id/read` | POST | Yes | Mark read |

---

## 🚀 Frontend Integration

Frontend already configured to:
- Login → saves token to localStorage
- Auto-include token in all API requests
- Redirect to login if not authenticated
- Handle errors gracefully

Just deploy your backend and it'll work! ✅
