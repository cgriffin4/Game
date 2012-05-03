var Class = require("./class");

var Messages = {};
module.exports = Messages;

var Message = Class.extend({
});

Messages.Spawn = Message.extend({
    init: function(entity) {
        this.entity = entity;
    }
});

Messages.Despawn = Message.extend({
    init: function(entityId) {
        this.entityId = entityId;
    }
});