var assert = require('assert')
var taskController = require('../app/controllers/taskController')
var moment = require('moment')


var testFunc = taskController.test;


var fakeUser = {id: 1}

// taskController.getTasksByUser(fakeUser, function(results) {
//   console.log('test results:', results)
// })


taskController.getWeek(function(results) {
    return console.log('results', results)
})

var results = taskController.getWeek(function(res) {

  var date1 = res[0].createdon
  var parsed = Date.parse(date)

})

describe('taskController', function() {
  describe('testFunc()', function() {
    it('should return 1 when called', function() {
      assert.equal(1, taskController.testFunc())
    })
  })

  describe('getWeek', function() {
    it('should return a call from the database', function() {
      assert.doesNotThrow(function() {
        taskController.getWeek()
      })
    })

    it('should return only days within the last week', function(done) {

      taskController.getWeek(function(results) {

        var daysArray = results.map(function(task) {
          return moment(task.createdon)
        })

        var lastWeek = moment().subtract(1, 'week')

        assert(daysArray.every(function(createDate) {
          return createDate.isSameOrAfter(lastWeek)
        }))

        done()

      })
    })
  })

  describe('momentjs syntax', function() {
    it('today should come after yesterday', function() {
      var today = moment()
      var yesterday = moment().subtract(1, 'day')

      assert(today.isSameOrAfter(yesterday))
    })
  })
})
