const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
    telegramID:{
    type:String,
        unique:true
},
  phone:{
      type: String
  },
  
  order:{
      type: [String]
  }
   
})

mongoose.model('clients', ClientSchema)