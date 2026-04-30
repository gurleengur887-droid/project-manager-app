const Project = require("../models/Project");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      members: [
        {
          user: req.user.id,
          role: "admin",
        },
      ],
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD MEMBER
exports.addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const User = require("../models/user");

    const project = await Project.findById(projectId);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = project.members.find(
      (m) => m.user.toString() === user._id.toString()
    );

    if (exists) {
      return res.status(400).json({ message: "Already a member" });
    }

    project.members.push({
      user: user._id,
      role: "member",
    });

    await project.save();

    res.json({ message: "Member added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};