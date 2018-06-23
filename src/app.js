const Exspress = require('express')
 const app = Exspress()
const nunjucks = require('nunjucks')
const BodyParser = require('body-parser')
const Config = require('./config')
const BD = require('./bd')
const helper = require ('./helper')



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




async function persLoad(ress){
    var mas = []
    var obj = {}
    const f = await BD.Client.find()// выбираю всех клиентов
  f.forEach(c => {// смотрю конкретного клиента
  // console.log(c.name) 
        const {order} = c // разбиваю объект информации о клиенте 
    //console.log(order)  , id, name, updatedAt,  phone   
        order.forEach(i =>{// смотрю заказ клиента нужно добавить проверку на пустоту
            BD.Product.find({id:i})
                  .then(cc => {
//        console.log(cc)
                        cc.forEach( u =>{
                            // а тут нужно всетаки товары ложить в массив 
                          mas.push(u.name)
                         
                      })
                    //  console.log(mas)
                     console.log(mas)
                     obj = {
                         name: с.name,
                         order: mas,
                         phone:с.phone,
                         stutus:"выполнение"
                
                     }
                     // вот на этом этапе нужно отправлять данные на вьюшку
                     ress.render('index.html', {
                         persons:obj
                     })
            })
        })
    })

 //console.log('kykysya')
  
//console.log(f)

//BD.Client.find().then(c =>{
//
//         c.forEach(cc=>{
//            //    console.log(cc)
//                
//                const {order, id, name, updatedAt,  phone  } = cc
//                order.forEach(i =>{
////                     console.log(i)
//                    BD.Product.find({id:i}).then(item =>{
//                        
//                            item.forEach(r =>{
//                             
//                                mas.push(r.name)
////                                console.log(mas)
//                                      
//                            })
////                         console.log(item)
//                            
//                          
//                    })
//                  
//                })
//                
//             
//                 
//     
//                
//         })
//           ress.render('index.html', {
//             persons:c
////                                persons:{
////                                name :name,
////                                order : mas,
////                                phone: phone,
////                                stutus: 'true'
////                                        }
//                                                            })
////  })
       
       
       
//          
//    })
//       
}
