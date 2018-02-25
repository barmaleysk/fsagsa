const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
    telegramID:{
    type:String, 
    required: true
},
  phone:{
      type: String,
      required: true
  },
  
  order:{
      type: [String]
  }
   
})

mongoose.model('clients', ClientSchema)