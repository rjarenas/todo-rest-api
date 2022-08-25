const Pool = require('pg').Pool;
const { DATABASE_CONNECTION  } = require('../database-connection');

const pool = new Pool(DATABASE_CONNECTION);

const getUserName = (request, response) => {
    const user_id = parseInt(request.params.id);
    
    pool.query('SELECT name FROM users WHERE user_id = $1;', [user_id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    })
}

module.exports = {
    getUserName,
}