import express from 'express';
import { isValidObjectId } from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get user notifications with pagination
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: req.user._id }),
      Notification.countDocuments({ user: req.user._id, read: false })
    ]);

    return res.json({
      notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
});

// Get unread count
router.get('/unread-count', requireAuth, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    return res.json({ count });
  } catch (err) {
    next(err);
  }
});

// Mark all as read
router.put('/read-all', requireAuth, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    return res.json({ ok: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

// Mark single notification as read
router.put('/:id/read', requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    notification.read = true;
    await notification.save();
    return res.json({ notification });
  } catch (err) {
    next(err);
  }
});

// Delete a notification
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Notification.deleteOne({ _id: notification._id });
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Delete all notifications
router.delete('/', requireAuth, async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    return res.json({ ok: true, message: 'All notifications cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
