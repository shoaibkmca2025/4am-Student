import Notification from '../models/Notification.js';

/**
 * Creates a notification for a user.
 */
export const createNotification = async ({ userId, title, message, type = 'info', link = '' }) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      link
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};
