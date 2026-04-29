const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const { body, validationResult } = require("express-validator");

router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("projectId").notEmpty().withMessage("Project ID is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },
  createTask
);
router.get("/:projectId", authMiddleware, getTasks);
router.patch("/:id", authMiddleware, updateTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;