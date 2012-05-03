var Class = require("../../shared/js/class")
    ,log = require('../../shared/js/log')
    ,Player = require('../../shared/js/player');

// ======= GAME SERVER ========

module.exports = World = Class.extend({
    init: function(io, id, maxPlayers) {
        var self = this;

        this.id = id;
        this.maxPlayers = maxPlayers;
        this.socketServer = io.of('/' + this.id);
        
        this.entities = [];
        this.players = [];
        
        this.playerCount = 0;
        
        this.onConnection(function(socket) {
            // establish connection
            self.onPlayerConnect(socket, function(data, fn) {
                player = new Player(self, data.name);
                self.addPlayer(player);
                log.announce(self.socketServer, player.events['WORLD_CONNECT']);
                fn({world:{id:self.id, maxPlayers:self.maxPlayers},player:{name:player.name}});
            });
        });
    },
    
    onConnection: function(callback) {
        this.socketServer.on('connection',callback);
    },
    
    onPlayerConnect: function(socket, callback) {
        socket.on('playerConnect',callback);
    },
    
    addEntity: function(entity) {
        this.entities.push(entity);
    },
    
    addPlayer: function(player) {
        this.addEntity(player);
        this.players.push(player);
        this.incrementPlayerCount();
    },
    
    setPlayerCount: function(count) {
        this.playerCount = count;
    },
    
    incrementPlayerCount: function() {
        this.setPlayerCount(this.playerCount + 1);
    },
    
    decrementPlayerCount: function() {
        if(this.playerCount > 0) {
            this.setPlayerCount(this.playerCount - 1);
        }
    }
});

