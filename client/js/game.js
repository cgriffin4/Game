resourcePath = "http://dl.dropbox.com/u/2760566/chris-griffin.info/projects/game/client/img/";

//the loading screen that will display while our assets load
Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete
    Crafty.load([resourcePath + "sprite.png"], function () {
        Crafty.scene("main"); //when everything is loaded, run the main scene
    });

    //black background with some loading text
    Crafty.background("#000");
    Crafty.e("2D, Canvas, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
            .text("Loading");
});

Crafty.scene("main", function () {
    generateWorld();
    
    //create our player entity with some premade components
    player1.crafty = Crafty.e('2D, Canvas, player, LeftControls, Ape')
        .attr({ x: player1._x, y: player1._y, z: player1._z })
        .leftControls(1)
        .Ape();
});

//turn the sprite map into usable components
Crafty.sprite(16, resourcePath + "sprite.png", {
    grass1: [0, 0],
    grass2: [1, 0],
    grass3: [2, 0],
    grass4: [3, 0],
    flower: [0, 1],
    bush1: [0, 2],
    bush2: [1, 2],
    player: [0, 3],
    enemy: [0, 3],
    banana: [4, 0],
    empty: [4, 0]
});

//method to generate the map
function generateWorld() {
    //loop through all tiles
    for (var i = 0; i < 25; i++) {
        for (var j = 0; j < 21; j++) {

            //place grass on all tiles
            grassType = Crafty.math.randomInt(1, 4);
            Crafty.e("2D, Canvas, grass" + grassType)
                .attr({ x: i * 16, y: j * 16, z:1 });
                
            //create a fence of bushes
            if(i === 0 || i === 24 || j === 0 || j === 20)
                Crafty.e("2D, Canvas, solid, bush" + Crafty.math.randomInt(1, 2))
                .attr({ x: i * 16, y: j * 16, z: 2 });
                
            //generate some nice flowers within the boundaries of the outer bushes
            if (i > 0 && i < 24 && j > 0 && j < 20
                    && Crafty.math.randomInt(0, 50) > 30
                    && !(i === 1 && j >= 16)
                    && !(i === 23 && j <= 4)) {
                Crafty.e("2D, Canvas, flower, SpriteAnimation")
                        .attr({ x: i * 16, y: j * 16, z: 1000 })
                        .animate("wind",  0, 1, 3 )
                        .animate('wind', 80, -1);
            }
            
            //grid of bushes
            if((i % 2 === 0) && (j % 2 === 0)) {
                Crafty.e("2D, Canvas, solid, bush1")
                    .attr({x: i * 16, y: j * 16, z: 2000})
            }
        }
    }
            
    Crafty.c("LeftControls", {
        init: function() {
            this.requires('Multiway');
        },
        
        leftControls: function(speed) {
            this.multiway(speed, {W: -90, S: 90, D: 0, A: 180})
            return this;
        }
        
    });
    
    Crafty.c('Ape', {
        Ape: function() {
                //setup animations
                this.requires("SpriteAnimation, Collision, Grid")
                .animate("walk_left", 6, 3, 8)
                .animate("walk_right", 9, 3, 11)
                .animate("walk_up", 3, 3, 5)
                .animate("walk_down", 0, 3, 2)
                //change direction when a direction change event is received
                .bind("NewDirection",
                    function (direction) {
                        if (direction.x < 0) {
                            if (!this.isPlaying("walk_left"))
                                this.stop().animate("walk_left", 10, -1);
                        }
                        if (direction.x > 0) {
                            if (!this.isPlaying("walk_right"))
                                this.stop().animate("walk_right", 10, -1);
                        }
                        if (direction.y < 0) {
                            if (!this.isPlaying("walk_up"))
                                this.stop().animate("walk_up", 10, -1);
                        }
                        if (direction.y > 0) {
                            if (!this.isPlaying("walk_down"))
                                this.stop().animate("walk_down", 10, -1);
                        }
                        if(!direction.x && !direction.y) {
                            this.stop();
                        }
                })
                .bind('Moved', function(from) {
                    if(this.hit('solid')){
                        this.attr({x: from.x, y:from.y});
                    }
                });
                
                return this;
            }
    });
}
