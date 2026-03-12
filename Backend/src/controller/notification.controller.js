import {
  createNotification,
  getUserNotifications,
  markNotificationReadModel
} from "../model/notification.model.js";

export const sendNotification = async (req, res) => {

  try {

    const id = await createNotification(req.body);

    res.json({
      success: true,
      notification_id: id
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getNotifications = async (req, res) => {

  try {

    const notifications = await getUserNotifications(req.params.userId);

    res.json(notifications);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const markNotificationRead = async (req, res) => {

  try {

    await markNotificationReadModel(req.params.id);

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};