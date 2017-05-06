var assert = require('assert')
var taskController = require('../app/controllers/taskController')
var moment = require('moment')
var serverIndex = require('../app/routes/index.js')
var helpers = require('../app/helpers/helpers.js')
var testFunc = taskController.test;


var fakeUser = {id: 1}

var weekStart = helpers.getWeekStart()

describe('taskController', function() {
  describe('testFunc()', function() {
    it('should return 1 when called', function() {
      assert.equal(1, taskController.testFunc())
    })
  })

  describe('getWeek', function() {
    it('should return a call from the database', function(done) {
      assert.doesNotThrow(function() {
        taskController.getWeek(function(results) {
          assert(results)
          done()
        })
      })
    })

    xit('should return only days within the last week', function(done) {

      taskController.getWeek(function(results) {

        var daysArray = results.map(function(task) {
          return moment(task.created_on)
        })
        // var lastWeek = moment().subtract(1, 'week').startOf('day')
        var lastWeek = moment().startOf('week')


        console.log(lastWeek, daysArray)
        assert(daysArray.every(function(createDate) {
          return createDate.isSameOrAfter(lastWeek)
        }))

        done()

      })
    })
  })
  describe('getTasksForWeek', function() {

    describe('when no arguments passed', function() {

      it('should return only tasks from the previous Sunday forward', function(done) {
        var weekStart = helpers.getWeekStart()

        taskController.getTasksForWeek(weekStart, function(results, err) {
          if(err) {
            return console.error('error with results ', err)
          }
          assert(results.every(function(res) {
            return moment(res.created_on).isAfter(moment(weekStart))
          }))
          done()
        })
      })
    })
    describe('when argument is passed', function() {
      var weekStart = helpers.getWeekStart(-1)

      it('should not include tasks before the specified date', function(done) {
        taskController.getTasksForWeek(weekStart, function(results, err) {
          if(err) {
            return console.error('error with results', err)
          }
          assert(results.every(function(res) {
            return moment(res.created_on).isAfter(moment(weekStart))
          }))
          done()
        })
      })
      it('should not include tasks after one week from the specified date', function(done) {
        taskController.getTasksForWeek(weekStart, function(results, err) {
          if(err) {
            return console.error('error with results', err)
          }
          assert(results.every(function(res) {
            return moment(res.created_on).isSameOrBefore(moment(weekStart).add(1, 'week'))
          }))
          done()
        })
      })
    })
  })
})

describe('helpers', function() {
  describe('getWeekStart', function() {

    it('should return the nearest Sunday when no arguments are passed', function() {
      var weekStart = helpers.getWeekStart()
      assert(weekStart.day() === 0)
    })
    it('should return the previous Sunday when -1 is passed', function() {
      var weekStart = helpers.getWeekStart(-1)
      assert(weekStart.day() === 0)
      assert(weekStart.isSame( moment().startOf('week').subtract(1, 'weeks') ) )
    })
    xit('should return the same day when given a Sunday', function() {
      var mmnt = moment('12-25-2017')
    })

  })
  describe('getWeek', function() {
    var weekStart = helpers.getWeekStart()
    var week = helpers.getWeek(weekStart)

    it('should return an array of 7 days', function() {

      assert(week.length === 7)
    })
    it('should contain each day of the week', function() {

      for(var i=0;i<7;i++) {
        assert(week[i].day() === i)
      }
    })
  })
})