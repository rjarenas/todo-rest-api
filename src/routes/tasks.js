const Pool = require('pg').Pool;
const { DATABASE_CONNECTION  } = require('../database-connection');

const pool = new Pool(DATABASE_CONNECTION);

const deleteCompletedTasks = (request, response) => {
  pool.query(`with removed_tasks as (DELETE FROM tasks WHERE complete = true RETURNING task_id)
    UPDATE users SET tasks = (SELECT array_agg(elem2) FROM removed_tasks, unnest(tasks) elem2 WHERE elem2 <> any(SELECT task_id FROM removed_tasks)) 
    RETURNING (SELECT task_id FROM removed_tasks);`,  (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rows == null) {
      response.status(200).send(`No tasks to delete.`);
    }
    else {
      response.status(200).send(`Deleted completed tasks.`);
    }
  });
}

const getUserTasks = (request, response) => {
  const user_id = parseInt(request.params.id);

  pool.query('SELECT b.* FROM users a LEFT JOIN tasks b ON b.task_id = ANY(a.tasks) WHERE a.user_id = $1 ORDER BY task_id ASC;',
    [user_id], (error, results) => {
    if(error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
}

const createUserTask = (request, response) => {
  const user_id = parseInt(request.params.id);
  const { description, complete } = request.body;

  pool.query(`WITH new_task as (INSERT INTO tasks (description, complete) VALUES ($1, $2) RETURNING task_id) 
    UPDATE users SET tasks = tasks || ARRAY(SELECT task_id FROM new_task)
    WHERE user_id = $3 RETURNING (SELECT task_id FROM new_task);`, [description, complete, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send({"task_id": results.rows[0].task_id, "description": description, "complete": complete});
  })
}

const updateTaskCompletion = (request, response) => {
  const task_id = parseInt(request.params.id);
  const { complete } = request.body;

  pool.query('UPDATE tasks SET complete = $1 WHERE task_id = $2 RETURNING *;', [complete, task_id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).send(results.rows[0]);
  })
}

const deleteTask = (request, response) => {
  const task_id = parseInt(request.params.id);

  pool.query('DELETE FROM tasks WHERE task_id = $1;', [task_id], (error, results) => {
    if (error) {
      throw error;
    }
    pool.query('UPDATE users SET tasks = ARRAY_REMOVE(tasks,$1)',[task_id], (error, results) => {
      if(error) {
        throw error;
      }
    })

    response.status(200).send(`Task deleted with ID ${task_id}`);
  });
}

module.exports = {
  getUserTasks,
  createUserTask,
  updateTaskCompletion,
  deleteTask,
  deleteCompletedTasks
}
