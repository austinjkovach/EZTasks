var moment = require('moment')

helperFunctions = {
  getTimestamp: getTimestamp,
  transformCheckboxData: transformCheckboxData,
  resolveRedirectPath: resolveRedirectPath,
  validateTextInput: validateTextInput,
  dataTransformer: dataTransformer,
  getWeekStartEnd: getWeekStartEnd,
  getWeekStart: getWeekStart,
  getWeek: getWeek,
  configureWeekObject: configureWeekObject
}

function getTimestamp() {
  // '2001-09-28 00:00:00'
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

function transformCheckboxData(data) {
  if(data.completed === undefined) {
    return false
  }
  return data.completed === "on" || data.completed
}

function resolveRedirectPath(headers) {
  var referer = headers.referrer || headers.referer

  // TODO Fix bug when trying to edit tasks that aren't the owner's
  if(!referer) {
    return console.error('No referer')
  }

  if(referer !== 'http://localhost:4000/profile') {
    return "/profile"
  }
  else {
    return "back"
  }
}

function validateTextInput(text, callback) {

  if (callback) {

    if(text === "") {
      return callback(false, "Test")
    }
    else {
      return callback(false, text);
    }
  }
  else {
    if(text === "") {
     return "Test"
    }
    else {
     return text;
    }
  }

}

function dataTransformer(obj) {
  var output = {}
  var keys = Object.keys(obj)

  keys.forEach(function(key) {
    output[key] = obj[key]
  })

  output.completed = this.transformCheckboxData(output)
  output.text = this.validateTextInput(output.text)

  return output
}

function getWeekStartEnd() {
  var now = moment()
  var weekStart = moment().startOf('week')
  var weekEnd = moment().endOf('week')

  return { start: weekStart, end: weekEnd }
}

function getWeekStart(num) {
  // TODO add arguments in order to specify week
  // Are arguments in moment() format or integers? (weeks from today)

  var now = moment().add(num, 'weeks')
  var weekStart = moment(now).startOf('week')

  return weekStart
}

function getWeek(mmnt, offset) {

  offset = offset || 0
  mmnt = mmnt || moment()
  var outputArray = [];
  var weekStart = getWeekStart(offset)


  for(var i=0;i<7;i++) {
    outputArray.push(moment(weekStart).add(i, 'days'))
  }

  return outputArray
}

function configureWeekObject(weekArray) {
  var dayName = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thur',
    'Fri',
    'Sat'
  ];

  return weekArray.map(function(day, i) {
    var month = day.month()+1;
    var date = day.date();
    return {
      timestamp: day,
      mmdd: month + '/' + date,
      day: dayName[i]
    };
  })
}

  /*

    functions to add or subtract 1 week from moment
    moment() --> weekStart() --> week[]


    1.DONE Find Closest Start of Week (Sunday) from given day
    2.DONE Find all days within 1 week of (1)
    3.DONE Find all tasks with create date within (2)
    4.DONE Apply dates to view
    5. Add 'date assigned' value to tasks
    6. Update (3) to find all tasks with assigned date within (2)

  */

module.exports = helperFunctions