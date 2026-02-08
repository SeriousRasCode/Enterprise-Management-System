import { getAllUsersModel, assignUserRoleModel, updateUserStatusModel, createRoleModel } from "../model/admin.model.js";

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


export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res
        .status(400)
        .json({ message: "is_active must be true or false" });
    }

    const updated = await updateUserStatusModel(userId, is_active);

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User ${is_active ? "activated" : "deactivated"} successfully`
    });

  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};



export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const result = await createRoleModel(name, description);

    if (result.error) {
      return res.status(409).json({ message: result.error });
    }

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      roleId: result.roleId
    });

  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
};
