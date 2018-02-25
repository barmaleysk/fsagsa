module.exports = {
   
logStart(){
    console.log('Ya rodilsya')
},
    
getChatId(msg){
  return msg.chat.id  
},
    
     getItemUuid(source) {
    return source.substr(2, source.length)
  }

}