/**
 * Notification service for interview reminders
 */

export interface InterviewReminder {
  id: string;
  company: string;
  role: string;
  time: string;
  reminderTime: "24h" | "1h" | "10m";
  interviewDateTime: Date;
}

/**
 * Check if the browser supports Notifications API
 */
export function supportsNotifications(): boolean {
  return "Notification" in window;
}

/**
 * Request permission to send notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!supportsNotifications()) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Send a notification
 */
export function sendNotification(title: string, options?: NotificationOptions) {
  if (supportsNotifications() && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/logo.png",
      badge: "/logo.png",
      ...options,
    });
  }
}

/**
 * Calculate when to send reminder based on interview time and reminder type
 */
export function calculateReminderTime(
  interviewDate: string, // YYYY-MM-DD
  interviewTime: string, // HH:MM
  reminderType: "24h" | "1h" | "10m"
): Date | null {
  try {
    const [y, m, d] = interviewDate.split("-").map(Number);
    const [h, min] = interviewTime.split(":").map(Number);

    const interviewDateTime = new Date(y, m - 1, d, h, min);

    // Calculate reminder time
    const reminderDate = new Date(interviewDateTime);
    switch (reminderType) {
      case "24h":
        reminderDate.setHours(reminderDate.getHours() - 24);
        break;
      case "1h":
        reminderDate.setHours(reminderDate.getHours() - 1);
        break;
      case "10m":
        reminderDate.setMinutes(reminderDate.getMinutes() - 10);
        break;
    }

    return reminderDate;
  } catch {
    return null;
  }
}

/**
 * Check if it's time to send a reminder (within 1 minute window)
 */
export function isTimeToRemind(targetTime: Date): boolean {
  const now = new Date();
  const diff = Math.abs(now.getTime() - targetTime.getTime());
  return diff < 60000; // within 1 minute
}

/**
 * Get reminder message based on reminder type
 */
export function getReminderMessage(
  company: string,
  role: string,
  interviewTime: string,
  reminderType: "24h" | "1h" | "10m"
): string {
  const messages = {
    "24h": `Interview tomorrow at ${interviewTime}`,
    "1h": `Interview coming up in 1 hour at ${interviewTime}`,
    "10m": `Interview starting in 10 minutes!`,
  };

  return `${company} - ${role}: ${messages[reminderType]}`;
}
