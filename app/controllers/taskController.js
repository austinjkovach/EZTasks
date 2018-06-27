// var pg = require('pg')
// var connectionString = configDB.url
// // var client = new pg.Client(connectionString)
var taskModel = require('../models/tasks.js')
var helpers = require('../helpers/helpers.js')
var pool = require('../../config/pgPool')
var moment = require('moment')


function createTask(data, callback) {
  let {user_id, text} = data;
  let currentTime = helpers.getTimestamp();

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error in CREATE TASK', err);
    }
    const query = `
      INSERT INTO tasks (
        text,
        owner,
        completed,
        created_on,
        assigned_time,
        starred
      )
      VALUES (
        '${text}',
        ${user_id},
        false,
        '${currentTime}',
        '${currentTime}',
        false
      )
      RETURNING
        id,
        text,
        completed,
        day,
        created_on,
        assigned_time,
        starred
    `


    client.query(query, function(err, result) {
      if(err){
        return console.error('error running TASK CREATE query', err);
      }
      console.log('successful creation:', result.rows)

      done(err)
      return callback(result.rows);
    })
  })
}

function getAllTasksByUser(user_id, callback) {

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
      SELECT id, text, completed, day, created_on, assigned_time, starred
      FROM tasks
      WHERE owner=${user_id}
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

function getTaskById(task_id, callback) {

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
    SELECT id, text, completed, day, created_on, assigned_time, starred
    FROM tasks
    WHERE id=${task_id}`

    client.query(query, function(err, result) {
      if(err){
          return console.error('error running SELECT query', err);
      }

      done(err)
      return callback(result.rows);

    })
  })
}

function getUserTasks(user_id, callback) {
    pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
      SELECT id, text, completed, day, created_on, assigned_time, starred
      FROM tasks
      WHERE owner=${user_id}
      ORDER BY assigned_time
    `

    client.query(query, function(err, result) {
      if(err){
        return console.error('error running SELECT query', err);
      }
      done(err)
      return callback(result.rows);
    })
  })
}


function getUserTasksInDateRange(start, end, callback) {
  // TODO stop hard-coding user_id
  let user_id = 1;
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    const query = `
    SELECT id, text, completed, day, created_on, assigned_time, starred
    FROM tasks
    WHERE owner=${user_id}
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

function updateTask(task_id, data) {
  console.log('UPDATE id', task_id)

    // id
    // text
    // completed
    // starred
    // assigned_time

}

function deleteTask(task_id) {
  console.log('DELETE id', task_id)
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error in DELETE TASKS', err);
    }

    const query = `
      DELETE FROM tasks WHERE id=${task_id}
      `

    client.query(query, function(err, result) {
      if(err){
        return console.error('error running TASK DELETE query', err);
      }
      done(err)
      return;
    })
  })
}

module.exports = {
  createTask,
  getAllTasksByUser,
  getUserTasks,
  getTaskById,
  getUserTasksInDateRange,
  updateTask,
  deleteTask,
}