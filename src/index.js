const TelegramBot = require('node-telegram-bot-api')
const Config = require('./config')
const Helper = require('./helper')
const keyboard = require('./keyboard')
const kb = require('./keyboard_buttons')
const mongoose = require('mongoose')
const prodBD = require('../database.json')
//const pg_start = require('./s')

//pg = "login.html"
//pg_start.start_pg(pg)


// Работа с БД
mongoose.connect(Config.DB_URL)//подключение к бд
    .then(()=>console.log('В бд'))// если все найс то выводим на консоль
    .catch(e => console.log(e))// если нет выводим ошибку

/////////////////////////////////////////////////////////////////////
const bot = new TelegramBot(Config.TOKEN, { // создаю подключение к боту
    polling:true
})
mongoose.Promise = global.Promise
require('./models/Product.model')// подключаем модель
const Product = mongoose.model('products')



require('./models/Client.model')// подключаем модель
const Client = mongoose.model('clients')

////////////////////////////////////////////работа с сервером
//const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const express = require('express')
const app = express()
const port = 3000


nunjucks.configure('src/public', {
    autoescape: true,
    express: app
});




app.get('/index.html', (req, res)=>{

    persLoad(res)
})


app.get('/', (request, response) => {

      response.sendFile(__dirname + '/public/login.html'  );

})

const BodyParser = require('body-parser')
app.use(BodyParser());



app.post('/index.html', function(req,res){

        if(req.body.login_ === 'admin'){
            persLoad(res)

            //res.render('index.html', {
            //    persons:
            //    // [{
            //    //    phone:'0986545',
            //    //    order:[1,4,6]
            //    //},
            //    //    {
            //    //        phone:'0986545',
            //    //        order:[1,4,6]
            //    //    }
            //    //]
            //    //JSON.stringify(clientt.phone)
            //
            //
            //
            //})
        }
    //else{
    //            res.render('login.html', {
    //
    //
    //
    //            })
    //    }



})


//app.post('./src/public/index.html', bodyparser, function(req,res){
//
//    Client.find().then(c => {
//        res.render('/public/index.html', {
//            persons:c
//        })
//    })
//
//
//
//    app.get('./src/public/index.html', bodyparser, function(req,res){
//
//        Client.find().then(c => {
//            res.render('/public/index.html', {
//                persons:c
//            })
//        })
//
//
//
//    })


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})

//////////////////////////////////////////////////////////

const ACTION_TYPE = {
    ADD_ORDER: 'aor',
    DEL_ORDER:'dor'
}

Helper.logStart()// есл все хорошо на консоль сообщение "Я родился"

//======================================================================== работа с Ботом


//принимаю сообщение
bot.on("message", msg => {
    console.log("Kyky", msg.text, msg.from.first_name)
    const chatId = Helper.getChatId(msg)
       // кейс клавиатур
    switch (msg.text){

           case kb.menu.aroll: //авторские роллы
            sendProdByQuery(chatId, {type_id:3})
            break


           case kb.menu.kroll: //классические роллы
            sendProdByQuery(chatId, {type_id:1})
            break
           case kb.menu.all: // все
            sendProdByQuery(chatId, {})
           break
        //bot.sendMessage(Helper.getChatId(msg), 'Ну выбирай)', {})


           case kb.menu.maki:// маки
            sendProdByQuery(chatId, {type_id:2})
         break
            case
            kb.menu.set: sendProdByQuery(chatId, {type_id:4})  // сеты
            break

            case kb.menu.order : // корзина
           // тут нужно отправить выбраные товары пользователю

                    sendOrderByQuery(chatId, {telegramID: chatId})

                    setTimeout(orderGo(chatId, {telegramID: chatId}), 15000);

             break
             case kb.order.reset:
                 sendOrderByQuery(chatId, {telegramID: chatId})

                 setTimeout(orderGo(chatId, {telegramID: chatId}), 15000);
            break


        case kb.home.geo:
            bot.sendMessage(Helper.getChatId(msg),"https://goo.gl/maps/kTF8inmUqk62 \n тел: 071-30-60-007" , {
                reply_markup:{
                    keyboard: keyboard.home
                }})
            break
            case kb.back:
                bot.sendMessage(Helper.getChatId(msg),"Возвращаемся" , {
                    reply_markup:{
                        keyboard: keyboard.home
                    }})
            break
        case  kb.home.mn:
            getMenu(chatId)
            //bot.sendMessage(Helper.getChatId(msg), "нямням", {
            //    reply_markup:{
            //        keyboard: keyboard.menu
            //    }})
            break

        case kb.order.go:
            /// тут нужно запросить номер у пользователя для связи
            OrderOf(chatId)
            //console.log('2')
            break

       }
        // кейс клавиатур

       })

// обрабатываю инлайн клавиатуру
bot.on('callback_query', query => {
    let data
    try {
        data = JSON.parse(query.data)
    }
    catch (e) {
        throw new Error('Data not obj')
    }
    const {type} = data
    if (type === ACTION_TYPE.ADD_ORDER) {// кннопка "добавить в корзину"
       Client.find({telegramID:data.chatId}) .then(c =>{
           if(c.length === 0){
            let ord = new Client({telegramID:data.chatId,order: data.prodId, name:data.name, timedate: new Date()})
            ord.save().catch(e=>{
                console.log(e)
            })
           }
           else{
               Client.update({telegramID:data.chatId}, {$push: {order: data.prodId}}).catch(e =>{
                   console.log(e)
               })
           }


       })
        bot.answerCallbackQuery(query.id, 'add', false)
    }



  if(type === ACTION_TYPE.DEL_ORDER){// кнопка удалить из корзины

      //console.log(data.prodId)

      //Client.findOne({telegramID:data.chatId, order: data.prodId }) .then(c =>{
      Client.findOneAndUpdate({telegramID:data.chatId},{$pull:{order:data.prodId}}) .then(c =>{

          //console.log(c)
      })
      .catch(e => {
              console.log(e)
          })
            bot.answerCallbackQuery(query.id, 'del', false)
          }

    })



// обрабатываю команду start, отвечаю приветствием
bot.onText(/\/start/, msg =>{
    const text = 'Здравствуйте, чего желаете, '+ msg.from.first_name+'?'
    bot.sendMessage(Helper.getChatId(msg), text, {
        reply_markup:{
            keyboard: keyboard.home
        }})
})



bot.onText(/((071|\+380)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/, msg =>{
    const chatID = Helper.getChatId(msg)

    Client.findOne({telegramID:chatID}) .then(c =>{
        if(c.order.length === 0){
            bot.sendMessage(chatID, "Для начала нужно сделать заказ", {
                reply_markup:{
                    keyboard: keyboard.menu
                }})

        }
        else {
            // нужно записать в бд номер телефона
            console.log(msg.text)
            Client.update({telegramID:chatID},{phone:msg.text}) .then(c =>{
                console.log(c)
            })
                .catch(e => {
                console.log(e)
            })
            const text = 'Ваш заказ зафиксирован, в ближайшем времени с вами свяжется оператор, '+ msg.from.first_name
            bot.sendMessage(chatID, text, {
                reply_markup:{
                    keyboard: keyboard.orderB
                }})
        }
    })



})


bot.on('polling_error', (error) => {
    console.log(error.code);  // => 'EFATAL'
});

// обрабатываю команду /p
bot.onText(/\/p(.+)/, (msg, [source, match])=>{
    const prodID = Helper.getItemUuid(source)
    const chatID = Helper.getChatId(msg)
    const name_ = Helper.getNameUser(msg)

//Client.findOne({telegramID:msg.from.id})
    Product.findOne({id:prodID}).then(prod => {
        const caption = `${prod.name}\nЦена: ${prod.price} руб.\nВыход: ${prod.out[0]} г \\ ${prod.out[1]} шт.\nСостав: ${prod.ingrid}  `
         bot.sendPhoto(chatID, prod.img, {
             caption: caption,
            reply_markup:{
                 inline_keyboard:[
                     [
                         {
                            text: 'Добавить в корзину',
                            callback_data:
                            JSON.stringify( {
                            type: ACTION_TYPE.ADD_ORDER,
                            prodId: prod.id,
                            chatId: chatID,
                            name:name_})


                         }
                     ]
                 ]
             }
         } )


    })

} )

function sendOrderByQuery(chatID, query)
{

    const options = {
        parse_mode: 'HTML'
    }

    Client.find(query) .then(c =>{
            c.forEach(cc=> {
                cc.order.forEach(ccc=> {
                    //sendProdByQuery(chatID,{id:ccc})
                    Product.findOne({id: ccc}).then(p=> {
                        //console.log(p)
                        //   bot.sendMessage(chatID, JSON.stringify(p.name), { parse_mode: 'HTML'} )
                        //   summ = Number(summ)  +  Number(p.out[0])
                        //   console.log(summ)
                        const cal = JSON.stringify({
                            type: ACTION_TYPE.DEL_ORDER,
                            prodId: p.id,
                            chatId: chatID
                        })

                        const inlinec = {
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [{text: 'Удалить', callback_data: cal}]
                                ]
                            }),
                            parse_mode: 'HTML'
                        }


                        bot.sendMessage(chatID, JSON.stringify(p.name), inlinec).then(_=> {
                            //return summ
                        })
                    })

                })
            })


    })



}

function orderGo(chatID,query)
{
    let summ = 0;
    let i=0;
    Client.find(query) .then(c => {

        c.forEach(cc=> {
            cc.order.forEach(ccc=> {

                Product.findOne({id: ccc}).then(p=> {

                    summ = Number(summ) + Number(p.price)
                    console.log(summ)

                    i++
                    if( cc.order.length === i) {
                        bot.sendMessage(chatID, "Сумма заказа = " + Number(summ)+' рублей', {
                            reply_markup: {
                                keyboard: keyboard.order
                            }
                        })
                    }
                })

            })

        })

    })
}

function sendProdByQuery(chatID, query)
{
    Product.find(query).then(prod =>{
      const html = prod.map((f,i)=> {
          return ` ${f.name} - /p${f.id}`
      }).join('\n')

      sendHTML(chatID, html, 'menu')
      })
}

function sendHTML(chatId, html, kbName = null) {
  const options = {
    parse_mode: 'HTML'
  }

  if (kbName) {
    options['reply_markup'] = {
      keyboard: keyboard[kbName]
    }

  }

  bot.sendMessage(chatId, html, options)
}

function OrderOf(chatID)
{
    const t = "Для того чтобы оформить заказ нам нужно знать ваш действующий номер телефона"
    bot.sendMessage(chatID, t) //,{
    //    reply_markup:{
    //        keyboard: keyboard.nomm
    //}} )

}

function persLoad(ress){
    Client.find().then(c =>{
        ress.render('index.html', {
            persons:c
        })
            .catch(er=>{
                console.log(er + ' er in render')
            })
    })
        .catch(er=>{
            console.log(er + ' er in find')
        })
}

function getMenu(chatID)
{
    bot.sendMessage(chatID, "нямням", {
        reply_markup:{
            keyboard: keyboard.menu
        }})
}

