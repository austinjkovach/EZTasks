let express = require('express');
let auth = express.Router();

var authConfig = require('../../config/auth')



module.exports = function(passport) {

  // THIS IS FROM SCOTCH
  auth.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  auth.get('/google/callback',
      passport.authenticate('google', {
          successRedirect : '/react',
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

  auth.get('/wakatime', passport.authenticate('wakatime'));

  auth.get('/wakatime/callback',
      passport.authenticate('wakatime', {
          successRedirect : '/',
          failureRedirect : '/'
      })
  );
  return auth
}
