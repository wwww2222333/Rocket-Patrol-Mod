class Play1 extends Phaser.Scene {
    constructor() {
        super("play1Scene");
    }

    preload() {
        //load images/title sprites
        this.load.image('rocket', './assets/hand.png');
        this.load.image('20', './assets/20.png');
        this.load.image('50', './assets/50.png');
        this.load.image('100', './assets/100.png');
        this.load.image('starfield', './assets/background.png');
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        //add Rocket (p1)
        this.p1Rocket = new Rocket1(this, game.config.width / 2, 401, 'rocket').setOrigin(0, 0);

        //add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 82, '20', 0, 20).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width, 135, '50', 0, 50).setScale(0.7).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width + 95, 205, '20', 0, 20).setOrigin(0, 0);
        this.ship04 = new Bonus(this, game.config.width, Phaser.Math.Between(110, 240), '100', 0, 100).setScale(0.7).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //adding mouse control 
        this.input.on('pointermove', function (pointer) {
            this.input.mouse.requestPointerLock();
            if (this.p1Rocket.x >= 47 || this.p1Rocket.x <= 598) {
                if (!this.p1Rocket.isFiring && !this.gameOver && this.input.mouse.locked) {
                    this.p1Rocket.x += pointer.movementX;
                    this.p1Rocket.x = Phaser.Math.Wrap(this.p1Rocket.x, 0, game.renderer.width);
                }
            }
            if (!this.gameOver && !this.isFiring && pointer.leftButtonDown()) {
                this.p1Rocket.isFiring = true;
                this.p1Rocket.sfxRocket.play();
            }
        }, this);

        //unlock the mouse
        this.input.keyboard.on('keydown_Q', function () {
            if (this.input.mouse.locked) {
                this.input.mouse.releasePointerLock();
            }
        }, this);



        //score
        this.p1Score = 0;
        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: "#6b8cff",
            align: 'right',
        }
        this.scoreLeft = this.add.text(10, 10, "Point:" + this.p1Score, scoreConfig);
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2 - 20, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (F) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.sound.pauseAll();
            this.sound.play('sfx_over');
        }, null, this);

    }

    update() {

        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.sound.play('sfx_select');
            this.sound.play('sfx_start');
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }

        //scroll starfield
        this.starfield.tilePositionX -= 0.1;  // update tile sprite

        if (!this.gameOver) {
            this.p1Rocket.update();  // update p1
            this.ship01.update(); // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }

        // explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });

    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                          //temporarily hide ship
        //create explosion sprite at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after animation completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                      // make ship visible again
            boom.destroy();                     //remove explosion sprite
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = 'Point:' + this.p1Score;

        this.sound.play('sfx_explosion');
    }

}
