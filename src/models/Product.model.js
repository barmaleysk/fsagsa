const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    
    id:{
        type: String,
        required: true
    },
     
    name:{
        type: String,
        required: true,
        default: " "
    },
    
    type_id :{
        type: String,
        max: 5,
        min: 1,
        required: true,
        default: 1
    },
    
    price: {
        type: String,
        required: true
    },
    
    img:
    {
        type:String,
        required : true
    },
    
    ingrid: 
    {
        type: [String]
    },
     out:
    {
        type: [String]
    }
    
})

mongoose.model('products', ProductSchema)