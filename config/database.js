// config/database.js
module.exports = {

    url : 'postgres://localhost:5432/tasks',
    poolConfig: {
      user: 'austinkovach',
      database: 'tasks',
      host: 'localhost',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    }

};