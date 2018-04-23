var helpers = require('../helpers/helpers.js')

var pool = require('../../config/pgPool')
var moment = require('moment')

function getTotalDurationByDay(user, date, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    // TODO ADD OPTIONAL 'PROJECT' PARAMS
    let query =  `SELECT SUM(duration)
                  FROM wakatime_durations
                  WHERE owner_id=${user.id}
                  AND date='${date}';`

    client.query(query, function(err, result) {
      if(err){
        return console.error('error connecting SELECT', err)
      }
      done(err)

      output = JSON.parse(result.rows[0].sum)

      return callback(output);
    })
  })
}


function getDurationsForWeek(user, date, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting SELECT', err)
    }

    // TODO USE DATE PARAMS
    let now = moment();
    let weekStart = helpers.getWeekStart(now)

    let queryDate = helpers.getDatestamp(weekStart);

    console.log('queryDate', queryDate)

    // TODO ADD OPTIONAL 'PROJECT' PARAMS

    let query =  `SELECT SUM(duration), date
                  FROM wakatime_durations
                  WHERE owner_id=${user.id}
                  AND date >= '${queryDate}'
                  AND date < '${queryDate}'::date + INTERVAL '7 days'
                  GROUP BY date;`
    //https://stackoverflow.com/questions/8732517/how-do-you-find-results-that-occurred-in-the-past-week

    client.query(query, function(err, result) {
      if(err){
        return console.error('error connecting SELECT', err)
      }
      done(err)
      return callback(result.rows);
    })
  })
}


function insertOrUpdateDuration(user, wakatimeDurationData, callback) {

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error connecting INSERT', err)
    }

    let selectQuery = `SELECT *
                       FROM wakatime_durations
                       WHERE date='${helpers.getDatestamp()}'`

    let insertQuery = `INSERT INTO wakatime_durations (
                owner_id,
                project_name,
                duration,
                date
                )
                VALUES (
                ${user.id},
                '${wakatimeDurationData.project}',
                ${wakatimeDurationData.duration},
                '${helpers.getDatestamp()}')`
    let updateQuery = `UPDATE wakatime_durations
                       SET project_name='${wakatimeDurationData.project}',
                           duration=${wakatimeDurationData.duration}
                           WHERE date='${helpers.getDatestamp()}'
                           AND owner_id=${user.id}`

    client.query(selectQuery, function(err, result) {
      if(err){
          return console.error('error running SELECT query', err);
      }
      if(result.rows.length <= 0) {
        client.query(insertQuery, function(err, result) {
          if(err){
            return console.error('error running INSERT query', err);
          }
          done(err)
          return callback(result.rows)
        })
      }
      else {
        client.query(updateQuery, function(err, result) {
          if(err){
            return console.error('error running UPDATE query', err);
          }
          done(err)
          return callback(result.rows)
        })
      }
    })
  })
}



module.exports = {
  insertOrUpdateDuration: insertOrUpdateDuration,
  getTotalDurationByDay: getTotalDurationByDay,
  getDurationsForWeek: getDurationsForWeek,
}