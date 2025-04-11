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

module.exports.createTask = async (title, status, contentTask, timeStart, timeFinish, createdBy) => {
    const result = await pool.query(
        'INSERT INTO tasks (title, status, contentTask,timeStart,timeFinish,createdBy) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *',
        [title, status, contentTask, timeStart, timeFinish, createdBy]
    );

    return result.rows[0];
};