const TelegramBot = require('node-telegram-bot-api')
const Config = require('./config')
const Helper = require('./helper')
const keyboard = require('./keyboard')
const kb = require('./keyboard_buttons')
const mongoose = require('mongoose')
const prodBD = require('../database.json')



const bot = new TelegramBot(Config.TOKEN, { // создаю подключение к боту
    polling:true
})
mongoose.Promise = global.Promise
require('./models/Product.model')// подключаем модель
const Product = mongoose.model('products')


require('./models/Client.model')// подключаем модель
const Client = mongoose.model('clients')

const ACTION_TYPE = {
    ADD_ORDER: 'aor',
    DEL_ORDER:'dor'
}

Helper.logStart()// есл все хорошо на консоль сообщение "Я родился"

// Работа с БД
mongoose.connect(Config.DB_URL)//подключение к бд
.then(()=>console.log('В бд'))// если все найс то выводим на консоль
.catch(e => console.log(e))// если нет выводим ошибку





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

            case kb.menu.order: // корзина
           // тут нужно отправить выбраные товары пользователю

                sendOrderByQuery(chatId, {telegramID: chatId}) .then(_ => {

                })
                orderGo(chatId, {telegramID: chatId})
                //console.log(r)
                //bot.sendMessage(Helper.getChatId(msg), "jhjh", {
                //    reply_markup:{
                //        keyboard: keyboard.order
                //    }})
             break


        case kb.home.geo:
            bot.sendMessage(Helper.getChatId(msg),"jfdfkjn" , {
                reply_markup:{
                    keyboard: keyboard.home
                }})
            break
            case kb.back:
                bot.sendMessage(Helper.getChatId(msg),"jfdfkjn" , {
                    reply_markup:{
                        keyboard: keyboard.home
                    }})
            break
        case  kb.home.mn:
            bot.sendMessage(Helper.getChatId(msg), "нямням", {
                reply_markup:{
                    keyboard: keyboard.menu
                }})
            break

        case kb.menu.ordrgo:
            /// тут нужно запросить номер у пользователя для связи
            //OrderOf(chatId, summ)


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

        Client.update({telegramID:data.chatId}, {$push: {order: data.prodId}}).then(c =>{
            if(c)
                    {
                       Client({telegramID: data.chatId,order: data.prodId}).save()
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


bot.on('polling_error', (error) => {
    console.log(error.code);  // => 'EFATAL'
});



// обрабатываю команду /p
bot.onText(/\/p(.+)/, (msg, [source, match])=>{
    const prodID = Helper.getItemUuid(source)
    const chatID = Helper.getChatId(msg)

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
                            chatId: chatID})


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

        c.forEach(cc=>{
            cc.order.forEach(ccc=>{
                //sendProdByQuery(chatID,{id:ccc})
                 Product.findOne({id:ccc}).then(p=>
                     {
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
                                     [{ text: 'Удалить', callback_data:cal} ]
                                 ]
                             }),
                             parse_mode: 'HTML'
                         }


                         bot.sendMessage(chatID, JSON.stringify(p.name), inlinec ).then (_=>{
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
    Client.find(query) .then(c => {

        c.forEach(cc=> {
            cc.order.forEach(ccc=> {
                //sendProdByQuery(chatID,{id:ccc})
                Product.findOne({id: ccc}).then(p=> {
                    //console.log(p)
                    //   bot.sendMessage(chatID, JSON.stringify(p.name), { parse_mode: 'HTML'} )
                    summ = Number(summ) + Number(p.out[0])

                })
            })
        })
    })

console.log(summ)




    bot.sendMessage(chatID, "Сумма заказа = "+ summ, {
        reply_markup:{
            keyboard: keyboard.order
        }})
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


