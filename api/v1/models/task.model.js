const pool = require('../../../config/pool');
const paginationHelper = require("../helpers/pagination");

module.exports.getTask = async ({ userId, status, title, sortKey, sortValue, page, limit }) => {
    const values = [userId];
    let whereClause = `(createdBy = $1 OR $1::text = ANY (
    SELECT jsonb_array_elements_text(listUser::jsonb)
    )) AND deleted = false `;
    let paramIndex = 2;
    let orderBy = '';
    if (status) {
        values.push(status);
        whereClause += ` AND status = $${paramIndex++}`;
    }

    if (title) {
        values.push(`%${title}%`);
        whereClause += ` AND title ILIKE $${paramIndex++}`;
    }

    if (sortKey && sortValue) {
        orderBy = `ORDER BY ${sortKey} ${sortValue.toUpperCase()} `;
    }

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM tasks WHERE ${whereClause}`,
        values
    );

    // pagination
    const total = parseInt(countResult.rows[0].count);
    let objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 5
        },
        { page, limit },
        total
    );
    //end pagination

    const dataResult = await pool.query(
        `SELECT * FROM tasks 
         WHERE ${whereClause} 
         ${orderBy}
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...values, objPagination.limitItems, objPagination.skip]
    );

    return {
        total,
        tasks: dataResult.rows
    };
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

module.exports.editTask = async (id, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');

    const result = await pool.query(
        `UPDATE tasks SET ${setClause} WHERE id =$1 RETURNING *`,
        [id, ...values]
    );

    return result.rows[0];
};