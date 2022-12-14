const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

//Set the port for local dev OR heroku
const port =  process.env.PORT || 3001;

//Routes
const tasks = require('./routes/tasks');
const users = require('./routes/users');

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Todo Rest API' })
})

//Task entry points
app.get('/user/:id/tasks', tasks.getUserTasks);
app.post('/user/:id/tasks', tasks.createUserTask);
app.patch('/tasks/:id', tasks.updateTaskCompletion);
app.delete('/tasks/:id', tasks.deleteTask);
app.delete('/tasks', tasks.deleteCompletedTasks);

//User entry points
app.get('/users/:id', users.getUser);

app.listen(port, () => {
  console.log(`Todo Rest API running on port ${port}.`);
})
