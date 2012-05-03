var Character, _,  server = false;

if(!(typeof exports === 'undefined')) {
    Character = require("./character");
    _ = require('underscore');
    server = true;
} else {
    Character = this.MyObjects.Character;
    _ = this._;
    server = false;
}

var Player = Character.extend({
    init: function(server, name) {
        var self = this;

        this._super(name, "player", 'Wizard', 16, 304, server);

        this.hasEnteredGame = false;
        this.isDead = false;
        
        
        this.setEvents([{
            name: 'WORLD_CONNECT'
            , type: 'playerConnect'
            , msg : this.id + ' has joined.' 
        }]);
    },
    events : {},
    setEvents : function (events) {
        var self = this;
        _.each(events, function (event) {
            self.events[event.name] = { serverName: self.server, type: event.type, msg: event.msg };
        });
    }
        
});

if(!(typeof exports === 'undefined')) {
    module.exports = Player;
} else {
    this.MyObjects.Player = Player;
}