var taskModel = require('../models/tasks.js')

var pg = require('pg')
var configDB = require('../../config/database.js')
var connectionString = configDB.url

var client = new pg.Client(connectionString)
var helpers = require('../helpers/helpers.js')

var poolConfig = configDB.poolConfig
var pool = new pg.Pool(poolConfig)

module.exports = {

  createTask: function(text, ownerId) {
    return new taskModel(text, ownerId)
  },

  getTasksByUser: function(user, callback) {
    var id = user.id

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error connecting SELECT', err)
      }
      client.query("SELECT id, text, completed, day FROM tasks WHERE owner=" + id + " ORDER BY completed, createdon ASC;", function(err, result) {
        if(err){
            return console.error('error running SELECT query', err);
        }

        done(err)
        return callback(result.rows);

      })
    })
  },

  editTask: function(id, data, callback) {
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
  },

  changeDay:function(id, data, callback) {

    var day = data.day

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error CONNECTING UPDATE', err)
      }

      client.query("UPDATE tasks SET day='" + data.day + "' WHERE id=" + id + ";", function(err, result) {
        if(err) {
          return console.error('error running UPDATE', err)
        }
        done(err)
        return callback();
      })
    })
  },

  deleteById: function(id, callback) {
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
  },

  findById: function(id, callback) {
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
}