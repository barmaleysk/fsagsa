module.exports.start_pg = function start_pg(pg)
{
    const express = require('express')
    const app = express()
    const port = 3000
    app.get('/', (request, response) => {

        response.sendFile(__dirname +'/public/'+pg);

    })
    app.listen(port, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`server is listening on ${port}`)
    })

}