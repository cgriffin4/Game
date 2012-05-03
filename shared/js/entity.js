var Class, server = false;

if(!(typeof exports === 'undefined')) {
    Class = require("./class");
    server = true;
} else {
    Class = this.MyObjects.Class;
    server = false;
}

var Entity = Class.extend({
    init: function(id, type, kind, x, y, server) {
        var self = this;
        
        this.id = id;
        this.type = type;
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.server = server;
        
        this.onMove = function () {
            this.server.emit('entity',{id: self.id, type: self.type, kind: self.kind, x: self.x, y: self.y });
        }
    },
    
    onMove : function(callback) {
        this.move = callback;
    },
    
    destroy: function() {

    },
    
    _getBaseState: function() {
        return [
            this.id,
            this.kind,
            this.x,
            this.y
        ];
    },
    
    getState: function() {
        return this._getBaseState();
    },
    
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    }
});

if(!(typeof exports === 'undefined')) {
    module.exports = Entity;
} else {
    this.MyObjects.Entity = Entity;
}