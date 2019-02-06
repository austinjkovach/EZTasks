let express = require('express');
let react = express.Router();
var path = require('path');

var taskController = require('../controllers/taskController.js')

// middleware that is specific to this router (demonstration)
react.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
react.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'));
})
// define the about route
react.get('/about', function (req, res) {
  res.send('About React')
})

react.get('/data', function(req, res) {
  taskController.getUserTasks(1, function(tasks) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(tasks))
  })
})

module.exports = react