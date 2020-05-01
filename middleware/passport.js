const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport')
const db = require('../models')
module.exports = passport => {
    passport.use(new GoogleStrategy({
        clientID: "508094425763-b2qvqlat6saml20eg04m0t83cgmcgk03.apps.googleusercontent.com",      
        clientSecret: "rJGe24Wq9jEzyCtf8cwPGdxx",
        callbackURL: "http://localhost:3000/users/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        db.USERS.findOne({email : profile._json.email})
        .then((usr) => {
            if(usr){
                usr.save().then(u => done(null,u) )
            }else{
                const newUser = new db.USERS({
                    email  : profile._json.email,
                })
                newUser.save()
                .then((user)=> {
                    return done(null,user)
                })
            }
        })
      }
    ));
    
}
module.exports = passport => {
    passport.use(new GitHubStrategy({
        clientID: "3b24795f237c489063ef",      
        clientSecret: "ffa4c0c5d0393fcb2250345fbe84a301ec8a381b",
        callbackURL: "http://localhost:3000/users/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        db.USERS.findOne({email : profile._json.email})
        .then((usr) => {
            if(usr){
                usr.save().then(u => done(null,u) )
            }else{
                const newUser = new db.USERS({
                    email  : profile._json.email,
                })
                newUser.save()
                .then((user)=> {
                    return done(null,user)
                })
            }
        })
      }
    ));

    }
