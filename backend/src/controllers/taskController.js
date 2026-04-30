const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    const task = await Task.create({
      title,
      description,
      projectId,
    });

    const io = req.app.get("io");
    io.to(projectId).emit("taskCreated", task);

    res.status(201).json(task);
  } catch (error) {
    console.log("❌ CREATE TASK ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS BY PROJECT
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    // 🔥 SOCKET EMIT 
    const io = req.app.get("io");
    io.to(updatedTask.projectId.toString()).emit("taskUpdated", updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted" });
  } catch (error) {
  next(error);
}
};