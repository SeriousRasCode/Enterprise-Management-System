import { getAllUsersModel, assignUserRoleModel } from "../model/admin.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const assignUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({ message: "Role name is required" });
    }

    await assignUserRoleModel(userId, roleName);

    res.status(200).json({
      success: true,
      message: "User role updated successfully"
    });

  } catch (error) {
    console.error("Assign role error:", error.message);
    res.status(400).json({ message: error.message });
  }
};



