var pg = require('pg')
var configDB = require('../../config/database.js')
var connectionString = configDB.url
var pool = require('../../config/pgPool');

var client = new pg.Client(connectionString)

function User() {

    this.local = {
        email        : '',
        password     : '',
    },
    this.google = {
        id           : '',
        token        : '',
        email        : '',
        name         : ''
    },

  this.save = function(callback) {
    var client = new pg.Client(connectionString);

    client.connect()

    console.log(this.email + ' will be saved')

    client.query('INSERT INTO users(email, password) VALUES($1, $2)', [this.email, this.password], function (err, result) {
        if(err){
            console.log(err);
            return console.error('error running query', err);
        }
        console.log(result.rows);
    });

    client.query('SELECT * FROM users ORDER BY uid desc limit 1', null, function(err, result){

        if(err){
            return callback(null);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0){
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email= result.rows[0]['email'];
            user.password = result.rows[0]['password'];
            user.uid = result.rows[0]['uid'];
            console.log(user.email);
            client.end();
            return callback(user);
        }
    });
  }
}

User.findOrCreate = function(profile, token, callback) {

  // var client = new pg.Client(connectionString);
  var response
  var pool = new pg.Pool(configDB.poolConfig)

  pool.connect(function(err, client, done) {
    if(err) {
        return console.error('error running query', err);
    }
    client.query('SELECT * FROM users WHERE uid=\'' + profile.id + '\';', function(err, result) {
      if(err){
          return console.error('error running query', err);
      }

      response = result.rows
      if(response.length === 0) {

        // Create user

        var query = "INSERT INTO users (email, uid, token) values ('" + profile.email + "', '" + profile.id + "', '" + token + "');"

        client.query(query, function(err, result) {

          if(err) {
            console.error('error inserting:', err)
          }

          console.log('insert result:', result)
          response = result;
        })
        done(err)
      }

      done(err);
      return callback(false, response[0])

    })
  })
}

User.findOne = function(email, callback){
  return callback(true)
};

User.findById = function(id, callback){


  var pool = new pg.Pool(configDB.poolConfig)
  // var client = new pg.Client(connectionString);
  var response

  pool.connect(function(err, client, done) {
    if(err) {
        return console.error('error running query', err);
    }

    client.query('SELECT * FROM users WHERE id=\'' + id + '\';', function(err, result) {
      if(err){
          return console.error('error running query', err);
      }

      response = result.rows[0]

      done(err)
      return callback(false, response)
    })
  })
};

User.addWakatimeToken = function(profile, token, callback) {
  var response;
  pool.connect(function(err, client, done) {
    if(err) {
        return console.error('error running query', err);
    }

    var query = "UPDATE users SET wakatimetoken = '" + token + "' WHERE id = '" + profile.id + "';"
    client.query(query, function(err, result) {
      if(err) {
        console.error('error inserting:', err)
      }

      client.query("SELECT * FROM users WHERE id = '" + profile.id + "';", function(err, result) {
        console.log('select result:', result);

        response = result;
        console.log('result:', result.rows[0])
        done(err);
        return callback(result.rows[0])
      })
      done(err);
    })

  })
}

//User.connect = function(callback){
//    return callback (false);
//};

//User.save = function(callback){
//    return callback (false);
//};

module.exports = User;


// ====================================================================
// ====================================================================

// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    wunderlist       : {
        email        : String,
        token        : String
    },
    wakatime         : {
        token        : String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
// module.exports = mongoose.model('User', User);
module.exports = User