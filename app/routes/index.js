// app/routes.js
var request = require('request');
var rp = require('request-promise');
var Task = require('../models/tasks')
var helpers = require('../helpers/helpers')
var wakatimeService = require('../helpers/wakatimeService')
var auth = require('../../config/auth')
var path = require('path');

var wakatimeController = require('../controllers/wakatimeController.js')
var taskController = require('../controllers/taskController.js')
var express = require('express')

// => https://expressjs.com/en/guide/routing.html
let react = require('./react');
let api = require('./api');
let tasks = require('./api/tasks')

module.exports = function(app, passport) {

    let authRoutes = require('./auth')(passport);

    var lastTimestamp = '';
    // app.use(express.static('client'))
    app.use(express.static(__dirname + '/dist'));

    // =====================================
    // REACT ===============================
    // =====================================
    app.use('/react', react)

    // =====================================
    // API =================================
    // =====================================
    app.use('/api', api)

    // =====================================
    // TASKS ===============================
    // =====================================
    // app.use('/api', api)

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('*', function (req, res) {
      res.sendFile(path.resolve('dist/index.html'));
    });


    // app.get('/', isLoggedIn, function(req, res) {
    //     res.redirect('/weekview'); // load the index.ejs file
    // });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('/login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/weekview', // redirect to the secure weekView section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // GOOGLE ==============================
    // =====================================

    app.use('/auth', authRoutes);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/weekview', // redirect to the secure weekView section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // WAKATIME ============================
    // =====================================

    /*

      TODO: WHY IS WAKATIME DURATION DATA GETTING POSTED TO DB TWICE?
       WE'RE HITTING ENDPOINT TWICE - WHY?

      user_id - int
      project_name - varchar(100)
      duration - int
      date - date

      SELECT SUM(duration)
      FROM wakatime_durations
      WHERE owner_id = XXX
      AND date = YYY

      1. wakatime tables -> id, owner id, project name, duration, date
      2. insert into table based on external wakatime API
      3. query table by user and date
      4. check if record exists for day
      5. accumulate durations for one week by table by user and date

    */

    // PLACEHOLDER TO INSERT TEST DURATIONS INTO DB
    // app.get('/api/wakatime/duration', function(req, res) {
    //   wakatimeController.insertOrUpdateDuration(req.user, { project: "test project", duration: 5 }, function(results) {
    //     res.redirect('/wakatime');
    //   })
    // })

    // // PLACEHOLDER TO INSERT REAL DURATIONS FROM PUBLIC WAKATIME API
    // app.get('/api/public/wakatime/duration/day', function(req, res) {
    //   let date = helpers.getDatestamp()
    //   let url = wakatimeService.composeUrl('durations', {date: date});

    //   rp(url)
    //     .then(function(result) {
    //       console.log('promise result:', result)
    //       let parsedBody = JSON.parse(result)
    //       let timeData = parsedBody.data.reduce((total, current) => (total += current.duration), 0);

    //       return timeData
    //     })
    //     .then(function(timeData) {
    //       wakatimeController.insertOrUpdateDuration(req.user, {project: 'All projects', duration: timeData}, function(results) {
    //         res.redirect('/wakatime');
    //       })
    //     })

    //   // request(url, parseWakatimeData)

    //   function parseWakatimeData(err, response, body) {
    //     let parsedBody = JSON.parse(body)
    //     let timeData = parsedBody.data.reduce((total, current) => (total += current.duration), 0);

    //     // wakatimeController.getTotalDurationByDay(req.user, helpers.getDatestamp(), function(result) {
    //     // })

    //     wakatimeController.insertOrUpdateDuration(req.user, {project: 'All projects', duration: timeData}, function(results) {
    //       res.redirect('/wakatime');
    //     })
    //   }
    // })

    // app.get('/api/wakatime/public/duration/week', function(req, res) {
    //   let date = helpers.getDatestamp();
    //   let urlsArray = [];

    //   let now = moment().format('YYYY-MM-DD');

    //   console.log('now', now)

    // })


    app.get('/wakatime', isLoggedIn, function(req, res) {
      // TODO: REFACTOR THIS INTO A SERVICE THAT I CAN WRAP AROUND ANY RES.RENDER
      wakatimeController.getDurationsForWeek(req.user, helpers.getDatestamp(), function(result) {
        res.render('wakatimedash', { data: result });
      })
    });

    // app.get('/auth/wakatime', passport.authenticate('wakatime'));

    // app.get('/auth/wakatime/callback',
    //     passport.authenticate('wakatime', {
    //         successRedirect : '/',
    //         failureRedirect : '/'
    //     })
    // );


      // res.redirect('/');


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    // app.get('/weekview', isLoggedIn, function(req, res) {

    //     taskController.getTasksByUser(req.user, function(tasks) {

    //       var completed = tasks.filter(function(task) {
    //         return task.completed
    //       })

    //       var incompleted = tasks.filter(function(task) {
    //         return !(task.completed)
    //       })

    //       var assignedMomentTasks = helpers.convertAssignedTime(tasks)
    //       var week = helpers.getWeek()
    //       var dates = helpers.configureWeekObject(week)

    //       var prev = helpers.formatMoment(week[0].subtract(1, 'week'))
    //       var next = helpers.formatMoment(week[0].add(1, 'week'))

    //       res.render('weekview', {
    //           user : req.user, // get the user out of session and pass to template
    //           tasks : assignedMomentTasks,
    //           dates: dates,
    //           // dates: [{ timestamp: moment('2017-12-25'), day: 'M' }]
    //           prev: prev,
    //           next: next
    //       });
    //     })
    // });

    app.get('/weekview/:timestamp?', isLoggedIn, findWeekTasks, findStarredTasks, function(req, res) {
    // https://stackoverflow.com/questions/28128323/rendering-view-after-multiple-select-queries-in-express

      var htmlFormattedTasks = helpers.convertHTMLCodeToSingleQuotes(req.assignedMomentTasks)

      res.render('weekview', {
          user : req.user, // get the user out of session and pass to template
          tasks : htmlFormattedTasks,
          starredTasks: req.starredTasks,
          dates: req.dates,  // dates: [{ timestamp: moment('2017-12-25'), day: 'M' }]
          prevWeek: req.prevWeek,
          nextWeek: req.nextWeek
      });
    })


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authorize('local-signup', {
            successRedirect : '/weekview', // redirect to the secure weekView section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    app.get('/unlink/local', function(req, res) {
        var user = req.user;

        user.local.email = undefined;
        user.local.password = undefined;

        user.save(function(err) {
            res.redirect('/weekview');
        });
    });


    // ==============================================================================
    // TASK ROUTES ==================================================================
    // ==============================================================================

    // app.get('/tasks', function(req, res) {
    //   res.render('/tasks')
    // })

    app.post('/tasks/create', function(req, res) {

      // validate text input
      helpers.validateTextInput(req.body.text, function(err, validText) {
        if(err) {
          console.error('Field cannot be blank')

          // show error to user
          res.redirect('back')
          return
        }

        // create task model
        var task = taskController.createTask(validText, req.user.id)

        task.save(function() {
          res.redirect('/weekview')
        });
      })
    })

    app.get('/tasks/edit/:id', isLoggedIn, function(req, res) {

        var task = taskController.findById(req.params.id, function(task) {
        var redirectPath = helpers.resolveRedirectPath(req.headers)

        if(task.owner !== req.user.id) {
          res.redirect(redirectPath)
        }
        task.assigned_time = helpers.formatMoment(task.assigned_time)

        res.render('edittask', { task: task, referer: '/weekview/' + lastTimestamp })
      })
    })

    app.post('/tasks/edit/:id', function(req, res) {
      // TODO validate user permissions
      var id = req.params.id
      var data = helpers.dataTransformer(req.body)

      taskController.validateUserAuthorization(req.user, id, function(valid) {

        if(!valid) {
          return
        }

        taskController.editTask(id, data, function() {
          res.redirect('back')
        })
      })
    })

    app.post('/tasks/delete/:id', function(req, res) {
      var id = req.params.id
      var redirectPath = helpers.resolveRedirectPath(req.headers)

      taskController.deleteById(id, function() {
        res.redirect(redirectPath)
      })
    })

    app.post('/tasks/changeday/:id', function(req, res) {

      console.log('changeday req.body', req.body)

      var redirectPath = helpers.resolveRedirectPath(req.headers)
      var data = {
        day: req.body.day
      }

      taskController.changeDay(req.params.id, data, function(){
        res.redirect('/weekview')
      })
    })

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function findWeekTasks(req, res, next) {


  lastTimestamp = req.params.timestamp || '';

  if(req.params.timestamp) {
    var mmnt = helpers.formatMoment(Math.floor(req.params.timestamp))
  }
  else {
    var mmnt = helpers.formatMoment()
  }
  var week = helpers.getWeekStart(mmnt)

  taskController.getTasksForWeek(req.user, week, function(tasks, err) {
    if(err) {
      console.error('error:', err)

    }

       req.completed = tasks.filter((task)=>task.completed)

       req.incompletedTasks = tasks.filter(function(task) {
        return !(task.completed)
      })

      if(req.params.timestamp) {
         req.mmnt = helpers.formatMoment(Math.floor(req.params.timestamp))
      }
      else {
         req.mmnt = helpers.formatMoment()
      }

       req.assignedMomentTasks = helpers.convertAssignedTime(tasks)
       req.week = helpers.getWeek(mmnt)
       req.dates = helpers.configureWeekObject(req.week)

       req.prevWeek = helpers.formatMoment(mmnt.subtract(1, 'week'))
       req.nextWeek = helpers.formatMoment(mmnt.add(2, 'week'))

       next()

  })
}

function findStarredTasks(req, res, next) {
  taskController.getStarredTasksForUser(req.user, function(tasks, err) {
    if(err) {
      console.error('error:', err)
    }
    req.starredTasks = tasks;

    next()
  })
}
