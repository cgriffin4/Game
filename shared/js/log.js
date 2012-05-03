var worlds = require('../../server');
    
module.exports = log = {
    
    debug : function (msg) {
        console.log(msg);
    },
    
    announce : function (serverName, announcement) {
        var world = _.find(worlds, function(data){ return worlds.id == serverName; });
        world.socketServer.send(announcement.msg);
        world.socketServer.emit(announcement.type, announcement.msg);
        this.debug(announcement.msg);
    }
}