import { useState, useEffect, useCallback } from "react";
import { api, NotificationResponse } from "@/lib/api";
import { toast } from "sonner";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await api.notifications.getNotifications();
        if (response.success) {
          setNotifications(response.data);
          setUnreadCount(response.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Simulate real-time updates with polling (replace with WebSocket in production)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await api.notifications.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const showNotification = useCallback((notification: NotificationResponse) => {
    const icons: Record<string, string> = {
      APPROVAL_REQUESTED: "📝",
      POST_APPROVED: "✅",
      POST_PUBLISHED: "🚀",
      POST_FAILED: "❌",
      COMMENT_ADDED: "💬"
    };

    const icon = icons[notification.type] || "📬";

    toast.custom(() => (
      <div
        className="bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-border p-4 w-80 cursor-pointer"
        onClick={() => markAsRead(notification.id)}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{notification.title}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(notification.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        </div>
      </div>
    ));
  }, [markAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    showNotification
  };
}
