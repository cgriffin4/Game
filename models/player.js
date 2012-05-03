var Player, Players, server = false;

if (typeof(Backbone) === 'undefined') {
    var Backbone = require('backbone');
    server = true
}

Player = Backbone.Model.extend({
    //Create a model to hold friend atribute
    name: null, // required
     
    initialize: function(attributes, options) {
        if (server) {
            var id = Math.floor((Math.random()*100)+1);
            this.id = id;
            this.set({id:this.id});
        } else {
            try {
                this.id = this.attributes.id;
            } catch (e) {}
        }
        console.log(this.id);
        //this.bind('change', this.save);
    }
});

Players = Backbone.Collection.extend({
    //This is our Friends collection and holds our Friend models
    initialize: function (models, options) {
        //Listen for new additions to the collection and call a view function if so
        this.on("add", function(player) {
          console.log('Player ' + player.get('name') + ' added.');
        });
    }
});

if (typeof(exports) !== "undefined") {
    exports.Player = Player;
    exports.Players = Players;
}