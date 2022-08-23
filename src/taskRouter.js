const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'todo_user',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});

const getTasks = (request, response) => {
  pool.query('select * from tasks order by id asc;', (error, results) => {
    if(error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
}

const createTask = (request, response) => {
  const { task, complete, user_id } = request.body;

  pool.query('INSERT INTO tasks (task, complete, user_id) VALUES ($1, $2, $3) RETURNING *;', [task, complete, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Task added with ID: ${results.rows[0].id}`);
  })
}

const updateTask = (request, response) => {
  const id = parseInt(request.params.id);
  const { complete } = request.body;

  pool.query('update tasks set complete = $1 where id = $2;', [complete, id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Task updated with ID: ${id}`);
  })
}


module.exports = {
  getTasks,
  createTask,
  updateTask
}
