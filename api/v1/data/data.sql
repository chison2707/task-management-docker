CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    token VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forgot_passwords (
    id SERIAL PRIMARY KEY,
    user_id: INTEGER,
    email VARCHAR(255),
    otp VARCHAR(10),
    expire_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    status VARCHAR(100),
    content TEXT,
    time_start TIMESTAMP,
    time_finish TIMESTAMP,
    createdBy INTEGER,
    listUser JSONB,
    task_parent_id INTEGER,
    deleted BOOLEAN DEFAULT FALSE,
    delete_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_created_by FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_task_parent FOREIGN KEY (task_parent_id) REFERENCES tasks(id) ON DELETE SET NULL
);