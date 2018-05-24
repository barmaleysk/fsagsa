const Config = require('./config')
const Mongoose = require('mongoose')


require('./models/Product.model')// подключаем модель



require('./models/Client.model')// подключаем модель



module.exports = {
    connect: Mongoose.connect(Config.DB_URL) .then(()=> console.log('В бд'))
    .catch(e => console.log(e)),
    Client : Mongoose.model('clients'),
    Product: Mongoose.model('products')
}

