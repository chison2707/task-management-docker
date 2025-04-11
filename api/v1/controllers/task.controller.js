const Task = require("../models/task.model");

const paginationHelper = require("../helpers/pagination");
const searchHelper = require("../helpers/search");

// [GET]/api/v1/tasks
module.exports.index = async (req, res) => {
    const userId = req.user.id;

    const tasks = await Task.getTask(userId);

    res.json(tasks)
};

// [POST]/api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        const createdBy = req.user.id;
        const { title, status, contentTask, timeStart, timeFinish } = req.body;
        const data = await Task.createTask(title, status, contentTask, timeStart, timeFinish, createdBy);
        res.json({
            code: 200,
            message: "Tạo thành công",
            data
        });
    } catch (error) {
        res.json({
            code: 500,
            message: "Error" + error.message
        });
    }
};

