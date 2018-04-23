const passport = require('passport');
const auth = require('../../config/auth');

function composeUrl(endpoint, options) {
  let output = 'https://wakatime.com/api/v1/users/current/' + endpoint;
  let optionKeys = Object.keys(options);


  if(options) {
    output += '?';
    let mappedOptions = optionKeys.map((key) => `${key}=${options[key]}`)
    let joinedOptions = mappedOptions.join('&');
    output += joinedOptions;
  }

  // TODO ADJUST THIS LOGIC IF OPTIONS NOT PROVIDED
  output += `&api_key=${auth.wakatimeAuth.apiKey}`;
  return output;
}

module.exports = {
  composeUrl: composeUrl,
};
