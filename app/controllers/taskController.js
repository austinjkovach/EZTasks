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
      client.query("SELECT id, text, completed, day, assigned_time FROM tasks WHERE owner=" + id + " ORDER BY completed, created_on ASC;", function(err, result) {
        if(err){
            return console.error('error running SELECT query', err);
        }

        done(err)
        return callback(result.rows);

      })
    })
  },

  editTask: function(id, data, callback) {

    // var textString = ''
    var completedString = ''
    var completedOnString = ''
    var dayString = ''

    console.log('data in editTask', data)
    if(data.completed === 'true') {
      var timestamp = helpers.getTimestamp()
      completedOnString = ", completed_on='" + timestamp + "'"
    }

    if(data.day) {
      dayString = ", day=" + data.day
    }

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error CONNECTING UPDATE', err)
      }

      client.query("UPDATE tasks SET text='" + data.text + "', completed=" + data.completed + dayString + completedOnString + " WHERE id=" + id + ";", function(err, result) {
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

  validateUserAuthorization: function(user, taskId, callback) {
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error connecting AUTH SELECT', err)
      }

      client.query("SELECT owner FROM tasks WHERE id=" + taskId + ";", function(err, result) {
        if(err) {
          return console.error('error running SELECT query', err)
        }

        done(err)

        var validationResults = result.rows[0].owner === user.id

        console.log('results owner:', result.rows, 'user', user)
        console.log('validation Results:', validationResults)

        return callback(validationResults)
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
  },

  testFunc: function() {
    return 1;
  },
  getWeek: function(callback) {
    //==>  https://www.postgresql.org/message-id/A3AC4FA47DC0B1458C3E5396E685E63302395E27@SAB-DC1.sab.uiuc.edu
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error connecting ', err)
      }
      client.query("SELECT * FROM tasks WHERE created_on > (CURRENT_DATE - INTERVAL '7 days')::date;", function(err, result) {
        if(err) {
          return console.error('error query ', err)
        }
        done(err)
        return callback(result.rows)
      })
    })
  },

  getTasksForWeek: function(weekStart, callback) {

    // Abstract this?
    var formattedDate = weekStart.format("YYYY-MM-DD hh:mm:ss")
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error connecting ', err)
      }
      client.query("SELECT * FROM tasks WHERE created_on > '" + formattedDate + "'::date AND created_on < (timestamp '" + formattedDate + "' + INTERVAL '7 days')::date;", function(err, result) {
        if(err) {
          return callback(null, err, weekStart, formattedDate)
        }
        return callback(result.rows)
      })
    })
  }
}