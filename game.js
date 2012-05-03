var http = require('http');
var fs = require('fs');
var url = require('url');
var staticResource = require('./index.js');
var backbone = require('backbone');
var models = require('./models/player');
var _ = require('underscore');

var Players = new models.Players();

// passing where is going to be the document root of resources.
var handler = staticResource.createHandler(fs.realpathSync('./'));

var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname;
    // handle method returns true if a resource specified with the path
    // has been handled by handler and returns false otherwise.
    if(!handler.handle(path, request, response)) {
        response.writeHead(404);
        response.write('404');
        response.end();
    }
});
server.listen(process.env.PORT || 8001);

/*
 * This is a stub for a socket.io server that responds to CRUD operations
 */
var io = require('socket.io').listen(server);
 
var create = function (socket, signature) {
    var e = event('create', signature), data = [];
    socket.emit(e, {id : 1});            
};
 
var read = function (socket, signature) {
    var e = event('read', signature), data;
    data.push({})
    socket.emit(e, data);            
};
 
var update = function (socket, signature) {
    var e = event('update', signature), data = [];
    socket.emit(e, {success : true});            
};
 
var destroy = function (socket, signature) {
    var e = event('delete', signature), data = [];
    socket.emit(e, {success : true});            
};
 
// creates the event to push to listening clients
var event = function (operation, sig) {
    var e = operation + ':'; 
    e += sig.endPoint;
    if (sig.ctx) e += (':' + sig.ctx);
 
    return e;
};

io.sockets.on('connection', function (socket) {
    socket.on('create', function (data, callback) {
        //create(socket, data.signature);
        var player = new models.Player(data.item);
        
        data.item.id = player.id;
        socket.broadcast.emit('create', data);
        
        socket.emit('joined',data);
        Players.each(function(player) {
            console.log(player);
            socket.emit('create',{item: player.attributes});
        });
        Players.add(player);
    });      
    socket.on('read', function (data) {
        read(socket, data.signature);
    });  
    socket.on('update', function (data) {
        var player = Players.get(data.item.id);
        player.set(data);
        
        socket.broadcast.emit('update', data);
    }); 
    socket.on('delete', function (data) {
        destroy(socket, data.signature);       
    });                
});