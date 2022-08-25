const Pool = require('pg').Pool;
const { DATABASE_CONNECTION  } = require('../database-connection');

const pool = new Pool(DATABASE_CONNECTION);

const getTasks = (request, response) => {
  pool.query('SELECT * FROM tasks ORDER BY task_id ASC;', (error, results) => {
    if(error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
}

const createTask = (request, response) => {
  const { description, complete, user_id } = request.body;

  pool.query('INSERT INTO tasks (description, complete, user_id) VALUES ($1, $2, $3) RETURNING *;', [description, complete, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Task added with ID: ${results.rows[0].task_id}`);
  })
}

const updateTaskCompletion = (request, response) => {
  const task_id = parseInt(request.params.id);
  const { complete } = request.body;

  pool.query('UPDATE tasks SET complete = $1 WHERE task_id = $2;', [complete, task_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Task updated with ID ${task_id} to completion ${complete}`);
  })
}

const deleteTask = (request, response) => {
  const task_id = parseInt(request.params.id);

  pool.query('DELETE FROM tasks WHERE task_id = $1;', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Task delete with ID ${task_id}`);
  });
}

module.exports = {
  getTasks,
  createTask,
  updateTaskCompletion,
  deleteTask
}
