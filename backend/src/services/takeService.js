const Task = require("../models/Task");

exports.createTaskService = async (data) => {
  return await Task.create(data);
};