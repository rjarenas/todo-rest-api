if (process.env.NODE_ENV == 'production') {
    const DATABASE_CONNECTION = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
}
else {
    const DATABASE_CONNECTION = {
        user: 'todo_user',
        host: 'localhost',
        database: 'postgres',
        password: 'root',
        port: 5432,
    };
    
}

exports.DATABASE_CONNECTION = DATABASE_CONNECTION;