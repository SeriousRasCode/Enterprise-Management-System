import { createNotification } from "../model/notification.model.js";
import { createActivityLog } from "../model/activityLogModel.js";

export const triggerEvent = async ({
  actor_id,
  action_type,
  entity_type,
  entity_id,
  description,
  notify_users = [],
  notification_title,
  notification_message
}) => {

  /* Activity Log */
  await createActivityLog({
    user_id: actor_id,
    action_type,
    entity_type,
    entity_id,
    description
  });

  /* Notifications */
  for (const userId of notify_users) {

    await createNotification({
      user_id: userId,
      title: notification_title,
      message: notification_message,
      entity_type,
      entity_id
    });

  }

};