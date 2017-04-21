// app/routes.js
var rp = require('request-promise');
var Task = require('../models/tasks.js')
var helpers = require('../helpers/helpers.js')

var taskController = require('../controllers/taskController.js')
// var configAuth = require('../config/auth');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // GOOGLE ==============================
    // =====================================

    // THIS IS FROM SCOTCH
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );

    // THIS IS FROM DOCS
    // app.get('/auth/google',
    //   passport.authenticate('google', { scope: 'email' });

    // app.get('/auth/google/callback',
    //   passport.authenticate('google', { failureRedirect: '/login' }),
    //   function(req, res) {
    //     res.redirect('/');
    //   });


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
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', function(req, res) {

        taskController.getTasksByUser({id: 1}, function(tasks) {

          var completed = tasks.filter(function(task) {
            return task.completed
          })

          var incompleted = tasks.filter(function(task) {
            return !(task.completed)
          })

          res.render('profile', {
              user : {id: 1}, // get the user out of session and pass to template
              tasks : tasks
          });
        })
    });

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
            successRedirect : '/profile', // redirect to the secure profile section
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
            res.redirect('/profile');
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
        var task = taskController.createTask(validText, 1)

        task.save(function() {
          res.redirect('/profile')
        });
      })
    })

    app.get('/tasks/edit/:id', function(req, res) {

      var task = taskController.findById(req.params.id, function(task) {

        res.render('edittask', { task: task })
      })

    })

    app.post('/tasks/edit/:id', function(req, res) {
      // TODO validate user permissions

      var id = req.params.id
      var data = helpers.dataTransformer(req.body)

      taskController.editTask(id, data, function() {
        res.redirect('back')
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
        res.redirect('/profile')
      })
    })

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
