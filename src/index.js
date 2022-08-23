const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 3001;

const db = require('./taskRouter');

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/tasks', db.getTasks);
app.post('/tasks', db.createTask);
app.put('/tasks/:id', db.updateTask);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})
