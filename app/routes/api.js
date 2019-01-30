
let helpers = require('../helpers/helpers');
let express = require('express');
let api = express.Router();
const pool = require('../../config/pgPool');
let taskController = require('../controllers/taskController.js')

let tasks = require('./api/tasks')


api.use('/tasks', tasks)

module.exports = api;

////////////
// NOTES  //
////////////

// // https://medium.com/studioarmix/learn-restful-api-design-ideals-c5ec915a430f

// // HOW MICROSOFT OUTLOOK CALENDAR HANDLES EVENTS BY DATE RANGE
// // https://msdn.microsoft.com/en-us/office/office365/api/calendar-rest-operations#GetEvents
// // GET https://outlook.office.com/api/v2.0/me/calendarview?startDateTime={start_datetime}&endDateTime={end_datetime}
// // GET https://outlook.office.com/api/v2.0/me/calendars/{calendar_id}/calendarview?startDateTime={start_datetime}&endDateTime={end_datetime}


// // USE THIS TO CONVERT TO UNIX TIMESTAMP
// // select extract(epoch from assigned_time) from tasks

// // // middleware that is specific to this router
// // api.use(function timeLog (req, res, next) {
// //   console.log('Time: ', Date.now())
// //   next()
// // })
