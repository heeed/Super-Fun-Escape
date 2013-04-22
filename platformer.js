
window.addEventListener("load",function() {

// Setup engine
var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI") //Include Components
        // Maximize
        .setup({ maximize: true})
        // allow touch and normal controlls
        .controls().touch()

//Player!
Q.Sprite.extend("Player",{

  // the init constructor is called on creation
  init: function(p) {

    this._super(p, {
      sheet: "player",  // Set the GFX
      x: 33,           
      y: 704             
    });

    //The 2D Lib is designed to allow quick and easy use of making a 2D Game
    this.add('2d, platformerControls');
    //When the sprite hits something
    this.on("hit.sprite",function(collision) {
      // if its the tower you win
      if(collision.obj.isA("Tower")) {
        Q.stageScene("endGame",1, { label: "You Won!" }); 
        this.destroy();
      }
    });

  }

});


//Sprite for the tower
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  }
});

//Enemy!
Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: 100 });

    // Enemys use an AI Library
    this.add('2d, aiBounce');

    // When it collides kill the person.
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "You Died" }); 
        collision.obj.destroy();
      }
    });

    //But if it collides ontop they kill it
    this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy();
        collision.obj.p.vy = -300;
      }
    });
  }
});

// Create the level
Q.scene("level1",function(stage) {


  // Add in the tiles from the .json sheet
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' }));

  // add the player
  var player = stage.insert(new Q.Player());

  // Make the screen follow the player
  stage.add("viewport").follow(player);

//Add in the enemys at these points.
stage.insert(new Q.Enemy({ x: 1120, y: 640}))
stage.insert(new Q.Enemy({ x: 1290, y: 640}));;
stage.insert(new Q.Enemy({ x: 1280, y: 640}));
stage.insert(new Q.Enemy({ x: 1300, y: 640}));
stage.insert(new Q.Enemy({ x: 1332, y: 640}));
stage.insert(new Q.Enemy({ x: 400, y: 640 }));
stage.insert(new Q.Enemy({ x: 500, y: 640 }));
stage.insert(new Q.Enemy({ x: 600, y: 640 }));
stage.insert(new Q.Enemy({ x: 300, y: 640 }));


  // Add in the tower / portal
  stage.insert(new Q.Tower({ x: 47, y: 275 }));
});

//Show the ending screen
Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Play Again" }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: stage.options.label }));
//Restart the game
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });
//Fit the contents but leave padding
  container.fit(20);
});

//Load assets
Q.load("spritemap.png, sprites.json, level.json, tiles.png, background-wall.jpg", function() {
 

 //Add in the sprites and json
  Q.compileSheets("spritemap.png","sprites.json");

  // Finally run the game!
  Q.stageScene("level1");
});
});
