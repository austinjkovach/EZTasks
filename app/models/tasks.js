var pg = require('pg')
var configDB = require('../../config/database.js')
var connectionString = configDB.url

var client = new pg.Client(connectionString)
var helpers = require('../helpers/helpers.js')

var poolConfig = configDB.poolConfig
var pool = new pg.Pool(poolConfig)

var Task = function(text, ownerId) {

  var timestamp = helpers.getTimestamp();

    this.text = text;
    this.completed = false;
    this.ownerId = ownerId;
    this.createdOn = timestamp;

}

Task.prototype.save = function(callback) {

  var task = this;

    pool.connect(function(err, client, done) {
    if(err) {
        return console.error('error CONNECTING INSERT', err);
    }
    client.query("INSERT INTO tasks (text, owner, completed, createdon) values('" + task.text + "', " + task.ownerId + ", false, '" + task.createdOn + "')", function(err, result) {
      if(err){
          return console.error('error running INSERT query', err);
      }

      done(err)
      return callback();
    })
  })

  pool.on('error', function(err, client) {
    // if an error is encountered by a client while it sits idle in the pool
     // the pool itself will emit an error event with both the error and
     // the client which emitted the original error
     // this is a rare occurrence but can happen if there is a network partition
     // between your application and the database, the database restarts, etc.
     // and so you might want to handle it and at least log it out
     console.error('idle client error', err.message, err.stack)
  })
}

Task.edit = function(id, data, callback) {
  var completionString = ''

  if(data.completed) {
    var timestamp = helpers.getTimestamp()
    completionString = ", completedon='" + timestamp + "'"
  }

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error CONNECTING UPDATE', err)
    }

    client.query("UPDATE tasks SET text='" + data.text + "', completed=" + data.completed + completionString + " WHERE id=" + id + ";", function(err, result) {
      if(err) {
        return console.error('error running UPDATE', err)
      }
      done(err)
      return callback();
    })
  })
}

// Task.markAsComplete = function(id, callback) {

//   pool.connect(function(err, client, done) {
//     if(err) {
//       return console.error('error CONNECTING UPDATE', err)
//     }

//     client.query("UPDATE tasks SET completed=true WHERE id=" + id + ";", function(err, result) {
//       if(err) {
//         return console.error('error running UPDATE', err)
//       }
//       done(err)
//       return callback();
//     })
//   })
// }
// Task.markAsIncomplete = function(id, callback) {

//   pool.connect(function(err, client, done) {
//     if(err) {
//       return console.error('error CONNECTING UPDATE', err)
//     }

//     client.query("UPDATE tasks SET completed=false WHERE id=" + id + ";", function(err, result) {
//       if(err) {
//         return console.error('error running UPDATE', err)
//       }
//       done(err)
//       return callback();
//     })
//   })
// }
Task.deleteById = function(id, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error CONNECTING DELETE', err)
    }

    client.query("DELETE FROM tasks WHERE id=" + id + ";", function(err, result) {
      if(err) {
        return console.error('error running DELETE query', err)
      }

      done(err)
      return callback();
    })
  })
}

Task.findById = function(id, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    client.query("SELECT * FROM tasks WHERE id=" + id + ";", function(err, result) {
      if(err) {
        return console.error('error running SELECT query', err)
      }

      done(err)

      return callback(result.rows[0])
    })
  })
}

Task.getTasksByUser = function(user, callback) {
  var id = user.id

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }
    client.query("SELECT id, text, completed FROM tasks WHERE owner=" + id + " ORDER BY completed, createdon ASC;", function(err, result) {
      if(err){
          return console.error('error running SELECT query', err);
      }

      done(err)
      return callback(result.rows);

    })
  })
}

module.exports = Task