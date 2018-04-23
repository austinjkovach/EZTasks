// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;



// load up the user model
var User            = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');


// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });

    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        console.log('local', email, password)
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ 'email' :  email }, function(err, user) {

              // if there are any errors, return the error
              if (err) {
                console.log('logging error:', err)
                return done(err);
              }

              // check to see if theres already a user with that email
              if (user) {
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              } else {

                  // if there is no user with that email
                  // create the user
                  var newUser            = new User();

                  // set the user's local credentials
                  newUser.local.email    = email;
                  newUser.local.password = newUser.generateHash(password);

                  // save the user
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return
                  });
                  return done(null, newUser);
              }

          });

        });

    }));

  // =========================================================================
  // GOOGLE LOGIN ============================================================
  // =========================================================================

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {

      process.nextTick(function() {

          User.findOrCreate(profile._json, token, function (err, user) {

            if(err) {
              return done(err)
            }

            if(!user) {
              console.log('no user found!')
            }

            return done(null, user);

          });
      })
    }
  ));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!user.validPassword(password))
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, user);
      });

  }));

  // =========================================================================
  // WAKATIME AUTH ===========================================================
  // =========================================================================


    passport.use('wakatime', new OAuth2Strategy({
        authorizationURL: 'https://www.wakatime.com/oauth/authorize',
        tokenURL: 'https://www.wakatime.com/oauth/access_token',
        clientID: configAuth.wakatimeAuth.clientID,
        clientSecret: configAuth.wakatimeAuth.clientSecret,
        callbackURL     : configAuth.wakatimeAuth.callbackURL,
        passReqToCallback : true,
        scope: 'read_logged_time'

      },
      function(req, accessToken, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        var user = req.user;


        process.nextTick(function() {

          console.log('req.user', req.user);
          console.log("user code", req.query.code)

              if(req.user) {
                // TODO SAVE WAKATIME TOKEN IN DB

                // user.save(function(err) {
                //   if(err) {
                //     throw err;
                //   }
                //   return done(null, user);
                // })
                User.addWakatimeToken(req.user, req.query.code, function() {
                  return done(null, user);
                })
              }
              else {
                // TODO WHAT GOES HERE?
              }
          })
          return done(null, user);
    }));


};