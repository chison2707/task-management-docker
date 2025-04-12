const pool = require('../../../config/pool');

module.exports.getTask = async (id) => {
    const result = await pool.query(`SELECT * FROM tasks
    WHERE (createdBy = $1 OR $1::text = ANY (
    SELECT jsonb_array_elements_text(listUser::jsonb)
    )
        ) 
    AND deleted = FALSE`, [id]);

    return result.rows[0];
};

module.exports.detailtask = async (id) => {
    const result = await pool.query(
        'SELECT * FROM tasks WHERE id = $1 AND deleted = FALSE',
        [id]
    );

    return result.rows[0];
};

module.exports.createTask = async (title, status, contentTask, timeStart, timeFinish, createdBy) => {
    const result = await pool.query(
        'INSERT INTO tasks (title, status, contentTask,timeStart,timeFinish,createdBy) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *',
        [title, status, contentTask, timeStart, timeFinish, createdBy]
    );

    return result.rows[0];
};

module.exports.changeStatus = async (status, id) => {
    let result;
    if (Array.isArray(id)) {
        result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = ANY($2::integer[]) RETURNING *',
            [status, id]
        );
    } else {
        result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
    }
    return result.rows;
};

module.exports.deleteTask = async (id) => {
    let result;
    if (Array.isArray(id)) {
        result = await pool.query(
            'UPDATE tasks SET deleted = true WHERE id = ANY($1::integer[]) RETURNING *',
            [id]
        );
    } else {
        result = await pool.query(
            'UPDATE tasks SET deleted = true WHERE id =$1 RETURNING *',
            [id]
        );
    }
    return result.rows;
};