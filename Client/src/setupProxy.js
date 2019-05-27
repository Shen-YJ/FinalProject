const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
    app.use(proxy(['/api', '/auth/github','/upload','/download'], { target: 'http://192.168.2.149:5000'}));
}