var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')

app.listen(process.env.PORT || 8001);
process.env.NODE_ENV = process.env.NODE_ENV || 'c9'

// setup differently for heroku - websockets are not supported
io.configure('heroku', function(){
  io.enable('browser client etag');
  io.set('log level', 1);

  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.configure('c9', function(){
  io.set('log level', 1);
  io.set('transports', ['websocket']);
});

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
        io.sockets.emit('response', "[ECHO] " + process.env.NODE_ENV +data);
    });
    
    // remove user
    socket.on('disconnect', function (socket) {
        console.info('connection terminated');
    });
    
    console.info('connection established');
});