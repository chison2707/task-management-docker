const Task = require("../models/task.model");

const paginationHelper = require("../helpers/pagination");
const searchHelper = require("../helpers/search");

// [GET]/api/v1/tasks
module.exports.index = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Task.getTask({
            userId,
            status: req.query.status,
            title: req.query.title,
            sortKey: req.query.sortKey,
            sortValue: req.query.sortValue,
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit)
        });

        res.json({
            code: 200,
            message: 'Lấy danh sách task thành công',
            pagination: result.pagination,
            data: result.tasks
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Lỗi khi lấy task',
            error: error.message
        });
    }
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

// [PATCH]/api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        console.log(data)

        const edit = await Task.editTask(id, data);

        res.json({
            code: 200,
            message: "Cập nhật thành công",
            edit
        });
    } catch (error) {
        res.json({
            code: 404,
            message: "error" + error.message
        });
    }
};