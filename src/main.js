/* 
Add your own (copyright-free) background music to the Play scene (5)
Create a new scrolling tile sprite for the background (5)
Create a new scrolling tile sprite for the background (5)
Allow the player to control the Rocket after it's fired (5)
Create a new title screen (e.g., new artwork, typography, layout) (10)
Create a new animated sprite for the Spaceship enemies (10)
Create a new sprite for the Spaceship enemies (10)
Implement parallax scrolling (10)
Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
Create and implement a new weapon (w/ new behavior and graphics) (20)
Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
Add Simultaneous 2P
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play1, Play2],
};

let game = new Phaser.Game(config);

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT, keyW, keyA, keyD;
// set UI sizes
let borderUISize = game.config.height;
let borderPadding = borderUISize;

//define Game settings
game.settings = {
    spaceshipSpeed: 3,
    bonusSpeed: 5,
    gameTimer: 60000,
}
