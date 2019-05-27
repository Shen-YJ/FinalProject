const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const authRoutes = require('./routes/authRoutes');
// const web3Routes = require('./routes/web3Routes');
const uploadRoutes = require('./routes/upload');

const cors = require('cors');

var fs = require('fs');


require('./models/User');

mongoose.connect(keys.mongoURI,{
  useNewUrlParser: true
});


require('./services/passport');

const app = express();

app.use(
  cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());


authRoutes(app);
// web3Routes(app)
uploadRoutes(app);

app.get('/',(req,res)=>{
  var form = fs.readFileSync('./index.html', {encoding: 'utf8'});
  res.send(form);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
  console.log("Server listening at port: " + PORT);
});








































// const express = require('express');
// const passport = require('passport');
// const githubStrategy = require('passport-github-oauth20').Strategy;
// var GitHubStrategy = require('passport-github').Strategy;
// const Keys = require('./config/keys');

// const fs = require('fs');
// var util = require('util');

// const app = express();
// passport.use(
//   new githubStrategy({
//     clientID: Keys.githubClientID,
//     clientSecret: Keys.githubClientSecret,
//     callbackURL: '/auth/github/callback'
//   },
//     (accessToken) => {
//       console.log(accessToken);

//     }
//   )
// );

// app.get('/auth/github', passport.authenticate(
//   'github',
//   {
//     scope: ['profile', 'email']
//   }
// ))

// app.get('/auth/github/callback', passport.authenticate(
//   'github'
// ))


// app.get('/', (req, res) => {
//   fs.writeFile('./req.json', util.inspect(req), (err) => {
//     if (err) throw err;
//     console.log("the file has been saved");

//   });
//   res.send({
//     hi: 'there',
//     bye: "8888"
//   });
//   fs.writeFile('./res.json', util.inspect(res), (err) => {
//     if (err) throw err;
//     console.log("the file has been saved");
//   });


// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT);

