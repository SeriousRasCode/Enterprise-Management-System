import {
  createActivityLog,
  getActivityLogs,
  getActivityFeedModel
} from "../model/activityLogModel.js";

export const logActivity = async (req, res) => {
  try {
    const id = await createActivityLog(req.body);

    res.json({
      success: true,
      activity_id: id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    // Filters can be passed via query parameters, e.g., /api/activities?entity_type=project&entity_id=1
    const activities = await getActivityLogs(req.query);

    res.json(activities);

  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};

export const getActivityFeed = async (req, res) => {

  try {
    const rows = await getActivityFeedModel();
    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
