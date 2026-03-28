import { useEffect, useState } from "react";
import { useApplications } from "@/context/ApplicationContext";
import {
  requestNotificationPermission,
  sendNotification,
  calculateReminderTime,
  isTimeToRemind,
  getReminderMessage,
} from "@/lib/notifications";

/**
 * Hook to manage interview reminders and send notifications
 * Call this once in your main App component to enable reminders globally
 */
export function useInterviewReminders() {
  const { applications } = useApplications();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [shownReminders, setShownReminders] = useState<Set<string>>(new Set());

  // Request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const permitted = await requestNotificationPermission();
      setRemindersEnabled(permitted);
    };

    setupNotifications();
  }, []);

  // Check for reminders every minute
  useEffect(() => {
    if (!remindersEnabled) return;

    const checkReminders = () => {
      applications.forEach((app) => {
        // Skip if no interview date/time or reminders not configured
        if (
          !app.interviewDate ||
          !app.interviewTime ||
          !app.reminders?.enabled ||
          !app.reminders?.times
        ) {
          return;
        }

        // Check each reminder type
        app.reminders.times.forEach((reminderType) => {
          const reminderKey = `${app.id}-${reminderType}`;

          // Skip if we already sent this reminder
          if (shownReminders.has(reminderKey)) {
            return;
          }

          const reminderTime = calculateReminderTime(
            app.interviewDate!,
            app.interviewTime!,
            reminderType
          );

          if (reminderTime && isTimeToRemind(reminderTime)) {
            // Send notification
            const message = getReminderMessage(
              app.company,
              app.role,
              app.interviewTime!,
              reminderType
            );

            sendNotification(message, {
              body: `Interview at ${app.location || "TBD"}`,
              tag: reminderKey, // Prevents duplicate notifications
            });

            // Mark as sent
            setShownReminders((prev) => new Set(prev).add(reminderKey));
          }
        });
      });
    };

    // Check immediately and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [applications, remindersEnabled, shownReminders]);

  return { remindersEnabled };
}
