var socket = null;
var server = null;

function connect() {
    log('Connecting to local server...');
    if (socket == null) {
        
        socket = io.connect(null,{'auto connect': false});
        
        socket.on('connect', function () {
            status('Connected');
            socket.emit('serverRequest', { name : 'World 1' }, function (world) {
                server = io.connect('/'+world.id);
                server.on('connect', function (world) {
                    //build world
                    Crafty.init(400, 336);
                    Crafty.scene("loading");
                });
                
                server.on('message', function (msg) {
                    console.log(msg);
                });
            });
        });
        
        socket.on('message', function (data) {
            log(data);
        });

        socket.on('response', function (data) {
            log(data);
        });
    }
    socket.socket.connect();
}

function send() {
    if (socket && socket.socket.connected) {
        socket.send(document.getElementById('text').value);
        log('>' + document.getElementById('text').value);
    } else {
        log('Not connected.');
    }
}

function update() {
    if (socket && socket.socket && socket.socket.transport) {
        document.getElementById('sessionId').textContent = socket.socket.transport.sessid;
        document.getElementById('transport').textContent = socket.socket.transport.name;
    } else {
        document.getElementById('sessionId').textContent = '-';
        document.getElementById('transport').textContent = '-';
    }
}
setInterval(update, 10);