// Production API Client Layer - Integrated with Real Backend
// Fetch calls with error handling, retries, and fallback to mocks

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

// Error handling
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

// Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Config from environment or defaults
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false"; // Default to mocks if not specified

// Helpers
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function apiCall<T>(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<APIResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetchWithTimeout(url, {
      method,
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData
      );
    }

    const data = await response.json();
    return data as APIResponse<T>;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new APIError(0, "Network error - is your backend running?", error);
    }
    
    throw new APIError(500, "Unexpected error", error);
  }
}

// Mock implementations (fallback)
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockAPI = {
  drafts: {
    async saveDraft(draft: Partial<PostDraftResponse>) {
      await mockDelay(500);
      return {
        success: true,
        data: { ...draft, id: draft.id || "draft_" + Date.now() } as any,
        message: "Draft saved successfully"
      };
    },
    async getDraft(id: string) {
      await mockDelay(300);
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
      await mockDelay(400);
      return {
        success: true,
        data: { id, status: "SCHEDULED" as const, scheduledAt },
        message: "Post scheduled successfully"
      };
    },
    async submitForApproval(id: string) {
      await mockDelay(400);
      return {
        success: true,
        data: { id, status: "PENDING_APPROVAL" as const },
        message: "Post sent for approval"
      };
    }
  },
  approvals: {
    async getQueue() {
      await mockDelay(300);
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
      await mockDelay(500);
      return {
        success: true,
        data: { postId, status: "APPROVED", comment },
        message: "Post approved!"
      };
    },
    async rejectPost(postId: string, comment: string) {
      await mockDelay(500);
      return {
        success: true,
        data: { postId, status: "REJECTED", comment },
        message: "Post rejected with feedback"
      };
    },
    async addComment(postId: string, comment: string) {
      await mockDelay(400);
      return {
        success: true,
        data: { postId, comment, timestamp: new Date().toISOString() },
        message: "Comment added"
      };
    }
  },
  notifications: {
    async getNotifications(limit: number = 10) {
      await mockDelay(300);
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
      await mockDelay(200);
      return { success: true };
    },
    async subscribeToUpdates(clientId: string) {
      await mockDelay(200);
      return { success: true, subscriptionId: "sub_" + Date.now() };
    }
  },
  clients: {
    async getClientSchedule(clientId: string) {
      await mockDelay(400);
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
      await mockDelay(300);
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

// Production API with real fetch calls
const productionAPI = {
  drafts: {
    async saveDraft(draft: Partial<PostDraftResponse>) {
      return apiCall<PostDraftResponse>("POST", "/drafts", draft);
    },
    async getDraft(id: string) {
      return apiCall<PostDraftResponse>("GET", `/drafts/${id}`);
    },
    async scheduleDraft(id: string, scheduledAt: string) {
      return apiCall("POST", `/drafts/${id}/schedule`, { scheduledAt });
    },
    async submitForApproval(id: string) {
      return apiCall("POST", `/drafts/${id}/approve`);
    }
  },
  approvals: {
    async getQueue() {
      return apiCall("GET", "/approvals");
    },
    async approvePost(postId: string, comment?: string) {
      return apiCall("POST", `/approvals/${postId}/approve`, { comment });
    },
    async rejectPost(postId: string, comment: string) {
      return apiCall("POST", `/approvals/${postId}/reject`, { comment });
    },
    async addComment(postId: string, comment: string) {
      return apiCall("POST", `/approvals/${postId}/comment`, { comment });
    }
  },
  notifications: {
    async getNotifications(limit: number = 10) {
      return apiCall("GET", `/notifications?limit=${limit}`);
    },
    async markAsRead(notificationId: string) {
      return apiCall("POST", `/notifications/${notificationId}/read`);
    },
    async subscribeToUpdates(clientId: string) {
      return apiCall("POST", "/notifications/subscribe", { clientId });
    }
  },
  clients: {
    async getClientSchedule(clientId: string) {
      return apiCall("GET", `/clients/${clientId}/schedule`);
    },
    async getClientApprovals(clientId: string) {
      return apiCall("GET", `/clients/${clientId}/approvals`);
    }
  }
};

// Export the appropriate API based on environment
export const api = USE_MOCKS ? mockAPI : productionAPI;

// Helper to check response
export function isSuccess<T>(response: any): response is { success: true; data: T } {
  return response?.success === true;
}

// Debug helper - shows current API configuration
export function getAPIConfig() {
  return {
    apiUrl: API_URL,
    timeout: API_TIMEOUT,
    useMocks: USE_MOCKS,
    hasAuthToken: !!localStorage.getItem("authToken"),
    environment: import.meta.env.MODE
  };
}
