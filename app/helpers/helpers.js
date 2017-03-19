var moment = require('moment')

module.exports = {

  getTimestamp: function() {
    // '2001-09-28 00:00:00'
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },

  transformCheckboxData: function(data) {
    return data.completed === "on"
  },

  resolveRedirectPath: function(headers) {
    var referer = headers.referrer || headers.referer

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
}