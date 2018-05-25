const Exspress = require('express')
 const app = Exspress()
const nunjucks = require('nunjucks')
const BodyParser = require('body-parser')
const Config = require('./config')
const BD = require('./bd')



app.use(BodyParser());


nunjucks.configure('src/public', {
    autoescape: true,
    express: app
});

app.get('/', (request, response) => {

      response.sendFile(__dirname + '/public/login.html'  );

})


app.post('/index.html', function(req,res){

        if(req.body.login_ === 'admin'){
            persLoad(res)

        }



})



app.listen(Config.Port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${Config.Port}`)
})




function persLoad(ress){
    BD.Client.find().then(c =>{
        ress.render('index.html', {
            persons:c
        })
//            .catch(er=>{
//                console.log(er + ' er in render')
//            })
    })
//        .catch(er=>{
//            console.log(er + ' er in find')
//        })
}
