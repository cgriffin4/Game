var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')

app.listen(process.env.PORT || 8001);
io.set('log level', 1);                    // reduce logging

function handler (req, res) {
    fs.readFile('index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200, {'Content-Type': 'text/html', "Content-Length": data.length});
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    // echo the message
    socket.on('message', function (data) {
        console.info(data);
        //socket.broadcast.emit('response', "[ECHO] "+data);
        io.sockets.emit('response', "[ECHO] "+data);
    });
    
    // remove user
    socket.on('disconnect', function (socket) {
        console.info('connection terminated');
    });
    
    console.info('connection established');
});