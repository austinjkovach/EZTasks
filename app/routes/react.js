let express = require('express');
let react = express.Router();

var taskController = require('../controllers/taskController.js')


// middleware that is specific to this router
react.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
react.get('/', function (req, res) {
  res.send(req.user.email)
})
// define the about route
react.get('/about', function (req, res) {
  res.send('About React')
})

react.get('/data', function(req, res) {
  let data = {name: 'austin', age: 28}
  taskController.getTasksByUser({id: 1}, function(tasks) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(tasks))
  })
})

module.exports = react