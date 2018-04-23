// var pg = require('pg')
// var connectionString = configDB.url
// // var client = new pg.Client(connectionString)
var taskModel = require('../models/tasks.js')
var helpers = require('../helpers/helpers.js')
var pool = require('../../config/pgPool')
var moment = require('moment')

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

      var query =  `SELECT id, text, completed, day, created_on, assigned_time, starred
                    FROM tasks
                    WHERE owner=${id}
                    ORDER BY completed, created_on ASC;`

      client.query(query, function(err, result) {
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
    var completedString = '';
    var completedOnString = '';
    var dayString = '';
    var dateString = '';
    var starredString = '';

    console.log('data in editTask', data)
    if(data.completed === 'true') {
      var timestamp = helpers.getTimestamp()
      completedOnString = ", completed_on='" + timestamp + "'"
    }

    if(data.assigned_time) {

      var formattedDayTimestamp = helpers.formatDate(data.assigned_time);

      dayString = ", assigned_time='" + formattedDayTimestamp + "'"
    }

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error CONNECTING UPDATE', err)
      }

      var query =  `UPDATE tasks
                    SET text='${helpers.validateTextInput(data.text)}', completed=${data.completed}, starred=${data.starred}${dayString}${completedOnString}
                    WHERE id=${id};`

      console.log("UPDATE query:", query)

      client.query(query, function(err, result) {
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
      var query = `SELECT owner
                   FROM tasks
                   WHERE id=${taskId};`
      client.query(query, function(err, result) {
        if(err) {
          return console.error('error running SELECT query', err)
        }

        done(err)

        var validationResults = result.rows[0].owner === user.id

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

      var query =  `SELECT *
                    FROM tasks
                    WHERE created_on > (CURRENT_DATE - INTERVAL '7 days')::date;`

      client.query(query, function(err, result) {
        if(err) {
          return console.error('error query ', err)
        }
        done(err)
        return callback(result.rows)
      })
    })
  },

  getTasksForWeek: function(user, weekStart, callback) {

    // Abstract this?
    var formattedDate = weekStart.format("YYYY-MM-DD hh:mm:ss");
    var query =`SELECT *
                      FROM tasks
                      WHERE owner=${user.id}
                      AND assigned_time >= '${formattedDate}'::date
                      AND assigned_time < (timestamp '${formattedDate}' + INTERVAL '7 days')::date
                      ORDER BY completed;`

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error connecting ', err)
      }

      client.query(query, function(err, result) {
        if(err) {
          return callback(null, err, weekStart, formattedDate)
        }
        return callback(result.rows)
      })

      done()
    })
  },
  getStarredTasksForUser: function(user, callback) {
    var query =  `SELECT *
                  FROM tasks
                  WHERE owner=${user.id}
                  AND completed=false
                  AND starred=true;`

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error connecting ', err)
      }

      client.query(query, function(err, result) {
        if(err) {
          return callback(null, err)
        }
        return callback(result.rows)
      })

      done()
    })
  }
}