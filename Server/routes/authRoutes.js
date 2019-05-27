const passport = require('passport');
const keys = require('../config/keys');


module.exports = (app) => {
  
  app.get('/auth/github', passport.authenticate(
    'github',
    {
      scope: ['profile']
    }
  ));

  app.get('/auth/github/callback',
   passport.authenticate('github'),
   (req, res) => {
     res.redirect(keys.callbackRedirectURL);
   }
   );

  app.get('/api/logout', (req,res) => {
    req.logout();
    res.redirect("/")
  })

  app.get('/api/current_user', (req,res) => {
    // res.send(req.session);
    res.send(req.user);
  })
}

