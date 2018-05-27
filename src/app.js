const Exspress = require('express')
 const app = Exspress()
const nunjucks = require('nunjucks')
const BodyParser = require('body-parser')
const Config = require('./config')
const BD = require('./bd')



app.use(BodyParser.urlencoded({ extended: false }));


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


app.get('/index.html', (req, res) => {

      persLoad(res)

})




app.listen(Config.Port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${Config.Port}`)
})



//app.post(`/bot${Config.TOKEN}`, (req, res) => {
//  bot.processUpdate(req.body);
//  res.sendStatus(200);
//});




function persLoad(ress){
    BD.Client.find().then(c =>{
        
//        const {name, order, phone, stutus} = c
        ///const obj = JSON.parse(c)
         //const {name, order, phone, stutus} = obj
         c.forEach(cc=>{
                console.log(cc)
                
                const {order, id, name, updatedAt,  phone  } = cc
                
                console.log(phone)
                
         })
    
      
        
        
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
