// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'      : '1093278685240-0jh6el0pduo9i2ikcfcad0i3fg40reil.apps.googleusercontent.com',
        'clientSecret'  : 'IG-fsuOGLLd8hbCrDmJ7uYsT',
        'callbackURL'   : 'http://localhost:4000/auth/google/callback'
    },
    "wakatimeAuth" : {
        "clientID"      : "KbwWEuqGqXNVHgt3nt5S7opw",
        "clientSecret"  : "sec_aViGJtfUzfk7mwgJNZvJT52eLqC6EK23LOLh20N8XMVpFgAm9JwmoMwyqxLNNcyoI0eFXv57tCsukhS4",
        "callbackURL"   : "http://localhost:4000/auth/wakatime/callback",
        "apiKey"        : "09d50992-8527-4d40-97dc-bf35249c24e2",

    }

};

// email - access user’s email and identity information.
// read_logged_time - access user’s coding activity and other stats.
// write_logged_time - modify user’s coding activity.
// read_stats - access user’s languages, editors, and operating systems used.
// read_teams -