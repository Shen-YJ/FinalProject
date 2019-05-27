const passport = require('passport');
// const githubStrategy = require('passport-github-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GitHubStrategy({
    clientID: keys.githubClientID,
    clientSecret: keys.githubClientSecret,
    callbackURL: keys.callbackURL
  },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ githubId: profile.id })
      if (existingUser) {
        // already registered
        done(null, existingUser);
      } else {
        const user = await new User({ 
          githubId: profile.id,
          username: profile.username
         }).save()
        done(null, user);
      }
      console.log('profile:', profile);
    }
  )
);