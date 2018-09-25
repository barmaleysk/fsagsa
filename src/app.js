const Exspress = require('express')
const app = Exspress()
const nunjucks = require('nunjucks')
const BodyParser = require('body-parser')
const Config = require('./config')
const BD = require('./bd')
const helper = require ('./helper')


const cookieParser = require('cookie-parser')
const passport = require('./auth')
const localStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');



app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

nunjucks.configure('src/public', {
    autoescape: true,
    express: app
});




app.get('/login.html', (req, res) => {
        console.log('ajdskhjasdnsamndsam')
      res.sendFile(__dirname + '/public/login.html'  );

})


app.post('/login.html', (req, res) => {
   
        console.log( req.body )
        

      res.status(200).sendFile(__dirname + '/public/login.html'  );
})

// app.post('/login.html', passport.authenticate('local', { successRedirect: '/index.html',
//                                                     failureRedirect: '/login.html' }));


// app.get('/profile', passport.authenticationMiddleware(), renderProfile)

app.get('/index.html',  (req, res) => {
        
     

})




app.listen(Config.Port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${Config.Port}`)
})



