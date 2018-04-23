var pg = require('pg');
var configDB = require('./database.js');

var poolConfig = configDB.poolConfig;
var pool = new pg.Pool(poolConfig);

module.exports = pool;