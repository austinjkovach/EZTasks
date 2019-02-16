
let helpers = require('../../helpers/helpers');
let express = require('express');
let tasks = express.Router();
const pool = require('../../../config/pgPool');

let taskController = require('../../controllers/taskController.js')
// TODO ES6 IMPORTS WITH NODE
// import { createTask } from '../controllers/taskController'

tasks.get('/', function (req, res) {
  if(req.query.start && req.query.end) {
    let tasks = taskController.getUserTasksInDateRange(req.query.start, req.query.end, (response) => {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(response));

        // Don't forget to call res.end() if you aren't rendering anything (ex returning JSON)
        res.end();
      })

  } else {
    let tasks = taskController.getUserTasks(1, (response) => {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(response));
        res.end();
      })
  }
})

tasks.post('/', (req, res)  => {
  taskController.createTask(req.body, (response) => {
    res.write(JSON.stringify(response));
    res.end();
  })
})

tasks.post('/complete/:task_id', (req, res)  => {
  taskController.toggleCompleteTask(req.params.task_id, req.body.completed, (response) => {
    res.write(JSON.stringify(response));
    res.end();
  })
})

tasks.put('/:task_id', (req, res) => {
  let data = req.body;
  let {task_id} = req.params
  console.log('PUT data', data, task_id)
  
  taskController.updateTask(task_id, data, (response) => {
    res.write(JSON.stringify(response));
    res.end();
  })
})

tasks.delete('/:task_id', (req, res) => {
  taskController.deleteTask(req.params.task_id, results => (results))
})

tasks.post('/complete/:task_id', (req, res)  => {
  taskController.toggleCompleteTask(req.params.task_id, req.body.completed, (response) => {
    res.write(JSON.stringify(response));
    res.end();
  })
})

module.exports = tasks