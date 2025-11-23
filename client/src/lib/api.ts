// API Client Layer - Ready to integrate with real backend
// Mock responses for now, swap with real fetch calls when backend is ready

export interface PostDraftResponse {
  id: string;
  title: string;
  caption: string;
  platform: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "SCHEDULED" | "PUBLISHED";
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalResponse {
  id: string;
  postDraftId: string;
  userId: string;
  action: "REQUESTED" | "APPROVED" | "REJECTED" | "COMMENT";
  comment?: string;
  createdAt: string;
}

export interface NotificationResponse {
  id: string;
  type: "APPROVAL_REQUESTED" | "POST_APPROVED" | "POST_PUBLISHED" | "POST_FAILED" | "COMMENT_ADDED";
  title: string;
  message: string;
  relatedId: string;
  read: boolean;
  createdAt: string;
}

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error handling wrapper
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Response wrapper with error handling
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const api = {
  // Draft endpoints
  drafts: {
    async saveDraft(draft: Partial<PostDraftResponse>) {
      await delay(500);
      return {
        success: true,
        data: { ...draft, id: draft.id || "draft_" + Date.now() },
        message: "Draft saved successfully"
      };
    },

    async getDraft(id: string) {
      await delay(300);
      return {
        success: true,
        data: {
          id,
          title: "Summer Collection Launch",
          caption: "Excited to announce our new summer collection...",
          platform: "instagram",
          status: "DRAFT" as const,
          scheduledAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },

    async scheduleDraft(id: string, scheduledAt: string) {
      await delay(400);
      return {
        success: true,
        data: { id, status: "SCHEDULED" as const, scheduledAt },
        message: "Post scheduled successfully"
      };
    },

    async submitForApproval(id: string) {
      await delay(400);
      return {
        success: true,
        data: { id, status: "PENDING_APPROVAL" as const },
        message: "Post sent for approval"
      };
    }
  },

  // Approval endpoints
  approvals: {
    async getQueue() {
      await delay(300);
      return {
        success: true,
        data: [
          {
            id: "approval_1",
            postDraftId: "post_2",
            title: "AI Breakthrough Post",
            client: "TechStart Inc",
            platform: "LINKEDIN",
            status: "PENDING_APPROVAL",
            submittedAt: new Date().toISOString()
          }
        ],
        count: 1
      };
    },

    async approvePost(postId: string, comment?: string) {
      await delay(500);
      return {
        success: true,
        data: { postId, status: "APPROVED", comment },
        message: "Post approved!"
      };
    },

    async rejectPost(postId: string, comment: string) {
      await delay(500);
      return {
        success: true,
        data: { postId, status: "REJECTED", comment },
        message: "Post rejected with feedback"
      };
    },

    async addComment(postId: string, comment: string) {
      await delay(400);
      return {
        success: true,
        data: { postId, comment, timestamp: new Date().toISOString() },
        message: "Comment added"
      };
    }
  },

  // Notification endpoints
  notifications: {
    async getNotifications(limit: number = 10) {
      await delay(300);
      return {
        success: true,
        data: [
          {
            id: "notif_1",
            type: "APPROVAL_REQUESTED" as const,
            title: "New approval request",
            message: "AI Breakthrough Post needs review",
            relatedId: "post_2",
            read: false,
            createdAt: new Date().toISOString()
          }
        ],
        unreadCount: 1
      };
    },

    async markAsRead(notificationId: string) {
      await delay(200);
      return { success: true };
    },

    async subscribeToUpdates(clientId: string) {
      // In production, this would establish a WebSocket connection
      await delay(200);
      return { success: true, subscriptionId: "sub_" + Date.now() };
    }
  },

  // Client portal endpoints
  clients: {
    async getClientSchedule(clientId: string) {
      await delay(400);
      return {
        success: true,
        data: {
          clientId,
          scheduledPosts: [
            {
              id: "post_1",
              title: "Summer Collection Launch",
              platform: "INSTAGRAM",
              scheduledAt: "2025-11-25T10:00:00Z",
              status: "SCHEDULED"
            }
          ]
        }
      };
    },

    async getClientApprovals(clientId: string) {
      await delay(300);
      return {
        success: true,
        data: {
          clientId,
          pending: [
            {
              id: "post_2",
              title: "AI Breakthrough Post",
              platform: "LINKEDIN",
              submittedAt: "2025-11-23T14:30:00Z"
            }
          ],
          approved: [],
          rejected: []
        }
      };
    }
  }
};

// Helper to check API response
export function isSuccess<T>(response: any): response is { success: true; data: T } {
  return response?.success === true;
}
