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

// [GET]/api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.detailtask(id);

        res.json(task);
    } catch (error) {
        res.json({
            code: 500,
            message: "error" + error.message
        });
    }

};

// [PATCH]/api/v1/tasks/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.status;

        const data = await Task.changeStatus(status, id);

        res.json({
            code: 200,
            message: "Update status thành công",
            data
        });
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        });
    }
};

// [PATCH]/api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { id, key, value } = req.body;

        console.log(req.body.id)

        switch (key) {
            case "status":
                const data = await Task.changeStatus(value, id)
                res.json({
                    code: 200,
                    message: "Update status thành công",
                    data
                });
                break;
            case "delete":
                const dataDelete = await Task.deleteTask(id);
                res.json({
                    code: 200,
                    message: "Xóa thành công",
                    dataDelete
                });
                break;
            default:
                res.json({
                    code: 404,
                    message: "Không tồn tại!"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        });
    }
};

// [DELETE]/api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Task.deleteTask(id);

        res.json({
            code: 200,
            message: "Xóa thành công",
            data
        });
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        });
    }
};