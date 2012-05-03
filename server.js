var url = require("url")
    , path = require("path")
    , fs = require('fs')
    , app = require('http').createServer(handler)
    , _ = require('underscore')
    , io = require('socket.io').listen(app)
    , World = require('./server/js/worldserver')
    , worlds = [];

app.listen(process.env.PORT || 8001);
process.env.NODE_ENV = process.env.NODE_ENV || 'c9';
module.exports = worlds;

function handler (request, response) {
    var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);
  
    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}

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

io.sockets.on('connection', function (socket) {
    // creates a new world if name already doesn't exist
    socket.on('serverRequest', function (data, fn) {
        var world = _.find(worlds, function(data){ return worlds.id == data.serverName; });
        
        if (!world) {
            world = new World(io, data.name, 4);
            worlds.push(world);
        }
        
        fn({id:world.id});
    });
    
    // echo the message
    socket.on('message', function (data) {
        //socket.broadcast.emit('response', "[ECHO] "+data);
        io.sockets.emit('response', "[ECHO] " +data);
    });
    
    // remove user
    socket.on('disconnect', function (socket) {
        log.debug('connection terminated');
    });
    
    log.debug('connection established');
});