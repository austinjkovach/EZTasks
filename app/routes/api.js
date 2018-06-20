// https://medium.com/studioarmix/learn-restful-api-design-ideals-c5ec915a430f

// HOW MICROSOFT OUTLOOK CALENDAR HANDLES EVENTS BY DATE RANGE
// https://msdn.microsoft.com/en-us/office/office365/api/calendar-rest-operations#GetEvents
// GET https://outlook.office.com/api/v2.0/me/calendarview?startDateTime={start_datetime}&endDateTime={end_datetime}
// GET https://outlook.office.com/api/v2.0/me/calendars/{calendar_id}/calendarview?startDateTime={start_datetime}&endDateTime={end_datetime}


let express = require('express');
let api = express.Router();
const pool = require('../../config/pgPool');

let taskController = require('../controllers/taskController.js')

// USE THIS TO CONVERT TO UNIX TIMESTAMP
// select extract(epoch from assigned_time) from tasks


// // middleware that is specific to this router
// api.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

api.get('/tasks', function (req, res) {
  let tasks = getAllUserTasksOnDay(req.query.start, req.query.end, (response) => {
      console.log('response', response)
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(response));

      // Don't forget to call res.end() if you aren't rendering anything (ex returning JSON)
      res.end();
    })
})

function getAllTasksByUserId(id, callback) {

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
    SELECT id, text, completed, day, created_on, assigned_time, starred
    FROM tasks
    WHERE owner=${id}
    ORDER BY assigned_time`

    client.query(query, function(err, result) {
      if(err){
          return console.error('error running SELECT query', err);
      }

      done(err)
      return callback(result.rows);

    })
  })
}

function getTasksById(id, callback) {

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
    SELECT id, text, completed, day, created_on, assigned_time, starred
    FROM tasks
    WHERE id=${id}`

    client.query(query, function(err, result) {
      if(err){
          return console.error('error running SELECT query', err);
      }

      done(err)
      return callback(result.rows);

    })
  })
}

function getAllUserTasksOnDay(start, end, callback) {
  // TODO stop hard-coding this
  let id = 1;
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
    SELECT id, text, completed, day, created_on, assigned_time, starred
    FROM tasks
    WHERE owner=${id}
    AND EXTRACT(EPOCH FROM assigned_time) BETWEEN '${start}' AND '${end}'
    ORDER BY assigned_time`

    client.query(query, function(err, result) {
      if(err){
        return console.error('error running SELECT query', err);
      }

      done(err)
      return callback(result.rows);

    })
  })
}

// define the home page route
// api.get('/tasks/:user_id', function (req, res) {
//   let tasks = getAllTasksByUserId(req.params.user_id, (response) => {
//       console.log('response', response)
//       res.setHeader('Content-Type', 'application/json');
//       res.write(JSON.stringify(response))
//     })
// })

// api.get('/tasks/:id', function (req, res) {
//   let tasks = getTaskById(req.params.user_id, (response) => {
//       console.log('response', response)
//       res.setHeader('Content-Type', 'application/json');
//       res.write(JSON.stringify(response))
//     })
// })

// // define the about route
// api.get('/about', function (req, res) {
//   res.send('About React')
// })

// api.get('/data', function(req, res) {
//   let data = {name: 'austin', age: 28}
//   taskController.getTasksByUser({id: 1}, function(tasks) {
//     res.setHeader('Content-Type', 'application/json');
//     res.write(JSON.stringify(tasks))
//   })
// })

module.exports = api