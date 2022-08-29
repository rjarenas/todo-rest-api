if (process.env.NODE_ENV == 'production') {
    var conditionalConnection = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
} else {
    var conditionalConnection = {
        user: 'todo_user',
        host: 'localhost',
        database: 'postgres',
        password: 'root',
        port: 5432,
    };    
}

const DATABASE_CONNECTION = conditionalConnection;

exports.DATABASE_CONNECTION = DATABASE_CONNECTION;