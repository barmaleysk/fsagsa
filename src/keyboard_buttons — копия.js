

var fs = require('fs');
var http = require('http');
function server_page() {


    //server.listen(8000, 'localhost');
    //server.on('request', function(req, res)  {
    //    res.end("Hello")
    //    res.render('index.html');
    //})



    http.createServer(function (req, res) {
        console.log(req.url);

        if (req.url === "/favicon.ico") {
            res.writeHead(404);
            res.end();
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        fs.createReadStream('./src/public/login.html').pipe(res);
    }).listen(8000);


}

exports.server_page = server_page;