var assert = require('assert')
var taskController = require('../app/controllers/taskController')
var wakatimeController = require('../app/controllers/wakatimeController')
var moment = require('moment')
var serverIndex = require('../app/routes/index.js')
var helpers = require('../app/helpers/helpers.js')
var wakatimeService = require('../app/helpers/wakatimeService.js')

var request = require('request');
var rp = require('request-promise');


var testFunc = taskController.test;

var taskModel = require('../app/models/tasks');
var pool = require('../config/pgPool');



var fakeUser = {id: 1}

// var weekStart = helpers.getWeekStart()

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
    var fakeUser = { id: 1 };
    var testMoment = moment('01-01-2017', 'MM-DD-YYYY');

    console.log('helpers', helpers.getWeekStart)

    describe('when no arguments passed', function() {

      it('should return only tasks from the previous Sunday forward', function(done) {
        var weekStart = helpers.getWeekStart(testMoment)

        taskController.getTasksForWeek(fakeUser, weekStart, function(results, err) {
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
      var weekStart = helpers.getWeekStart(testMoment)

      it('should not include tasks before the specified date', function(done) {
        taskController.getTasksForWeek(fakeUser, weekStart, function(results, err) {
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
        taskController.getTasksForWeek(fakeUser, weekStart, function(results, err) {
          if(err) {
            return console.error('error with results', err)
          }
          assert(results.every(function(res) {
            return moment(res.assigned_time).isSameOrBefore(moment(weekStart).add(1, 'week'))
          }))
          done()
        })
      })
      it('should return one result', function(done) {
        var fakeUser2 = { id: 2 };
        var weekStart = helpers.getWeekStart( moment('05-10-2017', 'MM-DD-YYYY') );

        taskController.getTasksForWeek(fakeUser2, weekStart, function(results, err) {
          if(err) {
            return console.error('error with results', err)
          }
          assert(results.every(function(res){
            return moment(res.assigned_time).isSameOrBefore(moment(weekStart).add(1, 'week'))
          }))

          assert.equal(results.length, 1);
          done()
        })
      })
    })
  })
})

describe('helpers', function() {
    var testMoment = moment('01-01-2017', 'MM-DD-YYYY');
    var testMoment2 = moment('01-07-2017', 'MM-DD-YYYY');

  describe('getWeekStart', function() {
    it('should return the nearest Sunday when no arguments are passed', function() {

      var weekStart = helpers.getWeekStart(testMoment);
      assert(weekStart.day() === 0)
    })
    it('should return a the previous Sunday when Saturday is passed', function() {
      var weekStart = helpers.getWeekStart(testMoment2);

      assert( weekStart.isSame(testMoment) );
    })
    it('should return the same day when given a Sunday', function() {
      var weekStart = helpers.getWeekStart(testMoment);
      assert( weekStart.isSame(testMoment) );
    })

  })
  describe('getWeek', function() {
    var testMoment = moment('01-01-2017', 'MM-DD-YYYY');


    var weekStart = helpers.getWeekStart(testMoment)
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
  describe('formatDate', function() {
    var dateString = '2017-05-08T05:00:00.000Z'
    var formattedDateString = helpers.formatDate(moment(dateString))

    assert.equal(moment(dateString).month() + 1, 5)
    assert.equal(formattedDateString, "2017-05-08 00:00:00")

  })

  describe('formatMoment', function() {
    var dateString = Math.floor('1494133200000')

    // assert.equal(moment(dateString).month(), 4)

    assert(moment(dateString).isSame(helpers.formatMoment(dateString)))
  })
})

describe('task creation', function() {
  it('should return', function(done){
    var taskArray = [];
    var task;

    for(var i=0;i<14;i++) {
      task = new taskModel(Math.floor(Math.random() * 10), 3)
      taskArray.push(task)
    }

    for(var i=0;i<taskArray.length;i++) {
      task = taskArray[i];
      task.save(function(index){if(index === 10){done()} }, i)
    }

    assert(true)
  })
})

describe('wakatime Controller', function() {
  describe('getTotalDurationByDay', function() {
    it('should return a result', function(done) {
      let input = {
        user: { id: 1 },
        date: '2017-09-22',
        project: 'test project',
      }

      wakatimeController.getTotalDurationByDay(input.user, input.date, function(result) {
        assert(result === 155)
        done()
      });
    })
  })
  describe('getDurationsByWeek', function(){
    it('should return an array with 7 dates', function(done) {

      let urlsArray = [];
      let weekStart = helpers.getWeekStart(moment());
      let promiseArray = [];

      weekStart = weekStart.subtract(1, 'week')

      for(let i=0;i<7;i++) {

        currentDay = moment(weekStart).add(i, 'days').format('YYYY-MM-DD');
        urlsArray.push(currentDay)
      }

      console.log('urlsArray:\n', urlsArray)

      assert.equal(urlsArray.length, 7);
      // let url;

      // for(let j=0;j<7;j++) {
      //   url = wakatimeService.composeUrl('durations', { date: urlsArray[j] })
      //   promiseArray.push(rp(url))
      // }
      urlsArray = urlsArray.map((url) => rp(wakatimeService.composeUrl('durations', { date: url })))


      Promise.all(urlsArray)
        .then(function(results) {

          return results.map((res) => JSON.parse(res))

        })
        .then(function(results) {
          // TODO I ONLY WANT THE ARRAY OF DURATIONS - NOT THE TOTAL (NEED TO UPDATE DB INDIVIDUALLY)

          // results = results.reduce((total, curr) => total += (curr.data.reduce(
          //   (t, c) => t += c.time), 0), 0)

        dataResults = results.map((res) => res.data)

        durationResults = dataResults.map((dRes) => {
          if(dRes.length === 0) {
            return 0;
          } else {
            return dRes.reduce((total, curr) => total += curr.duration, 0)
          }
        })
        console.log('res', durationResults.reduce((total, curr) => total += curr, 0))
          // console.log('rez', results.data.reduce((total, curr) => total += curr.duration))//.data.reduce(total, curr) => total += curr.time)
          done()
        })
        .catch(function(err) {
          console.log('error:', err)
        })

    })
  })
})
