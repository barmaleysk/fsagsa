const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
    telegramID:{
    type:String, 
    required: true
},
  phone:{
      type: String
  },
  
  order:{
      type: [String]
  },
    name:{
        type:String
    },
    timedate:{
        type:Date
    }
   
})

mongoose.model('clients', ClientSchema)