var Entity, server = false;
    
if(!(typeof exports === 'undefined')) {
    Entity = require("./entity");
    server = true;
} else {
    Entity = this.MyObjects.Entity;
    server = false;
}

var Character = Entity.extend({
    init: function(id, type, kind, x, y, server) {
        this._super(id, type, kind, x, y, server);
        
        
    },
    
    getState: function() {
        var basestate = this._getBaseState(),
            state = [];
        
        state.push(this.orientation);
        if(this.target) {
            state.push(this.target);
        }
        
        return basestate.concat(state);
    },
    
    hasFullHealth: function() {
        return this.hitPoints === this.maxHitPoints;
    },
    
    health: function() {
        
    },
    
    onMove: function(callback) {
        this.move = callback;
    }
});

if(!(typeof exports === 'undefined')) {
    module.exports = Character;
} else {
    this.MyObjects.Character = Character;
}