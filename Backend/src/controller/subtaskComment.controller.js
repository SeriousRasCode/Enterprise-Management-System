import {
  createSubtaskComment,
  getSubtaskCommentsModel
} from "../model/subtaskComment.model.js";

export const addSubtaskComment = async (req, res) => {

  try {

    const id = await createSubtaskComment(req.body);

    res.json({
      success: true,
      comment_id: id
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getSubtaskComments = async (req, res) => {

  try {

    const rows = await getSubtaskCommentsModel(req.params.subtaskId);

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};