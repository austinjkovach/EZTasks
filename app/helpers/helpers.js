var moment = require('moment')

module.exports = {

  getTimestamp: function() {
    // '2001-09-28 00:00:00'
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },

  transformCheckboxData: function(data) {
    if(data.completed === undefined) {
      return false
    }
    return data.completed === "on" || data.completed
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
  },

  validateTextInput: function(text, callback) {

    if (callback) {

      if(text === "") {
        return callback(false, "Test")
      }
      else {
        return callback(false, text);
      }
    }
    else {
      if(text === "") {
       return "Test"
      }
      else {
       return text;
      }
    }

  },

  dataTransformer: function(obj) {
    var output = {}
    var keys = Object.keys(obj)

    keys.forEach(function(key) {
      output[key] = obj[key]
    })

    output.completed = this.transformCheckboxData(output)
    output.text = this.validateTextInput(output.text)

    return output
  }
}