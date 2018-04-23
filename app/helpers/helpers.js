var moment = require('moment')

helperFunctions = {
  getTimestamp: getTimestamp,
  getDatestamp: getDatestamp,
  formatDate: formatDate,
  formatMoment: formatMoment,
  transformCheckboxData: transformCheckboxData,
  resolveRedirectPath: resolveRedirectPath,
  validateTextInput: validateTextInput,
  dataTransformer: dataTransformer,
  getWeekStartEnd: getWeekStartEnd,
  getWeekStart: getWeekStart,
  getWeek: getWeek,
  configureWeekObject: configureWeekObject,
  convertAssignedTime: convertAssignedTime,
  convertHTMLCodeToSingleQuotes: convertHTMLCodeToSingleQuotes,
}

function getTimestamp() {
  // '2001-09-28 00:00:00'
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

function getDatestamp(mmnt) {
  return mmnt ? mmnt.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")
}

function formatMoment(timestamp) {
  return timestamp ? moment(timestamp) : moment();
}

function formatDate(date) {
  var md = moment(date)
  return md.format("YYYY-MM-DD HH:mm:ss");
}

// function transformCheckboxData(data) {
//   if(data.completed === undefined) {
//     return false
//   }
//   return data.completed === "on" || data.completed
// }

function transformCheckboxData(data) {
  if(data === undefined) {
    return false;
  }
  return data === "on" || data
}

function resolveRedirectPath(headers) {
  var referer = headers.referrer || headers.referer

  // TODO Fix bug when trying to edit tasks that aren't the owner's
  if(!referer) {
    return console.error('No referer')
  }

  if(referer !== 'http://localhost:4000/weekview') {
    return "/weekview"
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

      text = text.replace(`'`, `&#39;`);
      return callback(false, text);
    }
  }
  else {
    if(text === "") {
     return "Test"
    }
    else {
      text = text.replace(`'`, `&#39;`);
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

  output.completed = this.transformCheckboxData(output.completed)
  output.starred = this.transformCheckboxData(output.starred)
  output.text = this.validateTextInput(output.text)

  return output
}

function getWeekStartEnd() {
  var now = moment()
  var weekStart = moment().startOf('week')
  var weekEnd = moment().endOf('week')

  return { start: weekStart, end: weekEnd }
}

function getWeekStart(mmnt) {
  // TODO add arguments in order to specify week
  // Are arguments in mmnt() format or integers? (weeks from today)
  return moment(mmnt.startOf('week'))
}

function getWeek(mmnt) {

  mmnt = mmnt || moment()
  var outputArray = [];
  var weekStart = getWeekStart(mmnt)

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
      day: dayName[i],
      unix: moment.unix(day),
    };
  })
}

function convertAssignedTime(tasks) {
  return tasks.map(function(task) {

    task.assigned_time = moment(task.assigned_time)
    return task;
  })
}

function convertHTMLCodeToSingleQuotes(tasks) {
  return tasks.map((task) => {
    task.text = task.text.replace(`&#39;`, `'`)
    return task;
  })
}
  /*

    functions to add or subtract 1 week from moment
    moment() --> weekStart() --> week[]


    1.DONE Find Closest Start of Week (Sunday) from given day
    2.DONE Find all days within 1 week of (1)
    3.DONE Find all tasks with create date within (2)
    4.DONE Apply dates to view
    5.DONE Add 'date assigned' value to tasks
    6. Update (3) to find all tasks with assigned date within (2)

  */

module.exports = helperFunctions