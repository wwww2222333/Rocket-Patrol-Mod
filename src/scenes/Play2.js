class Play2 extends Phaser.Scene {
  constructor() {
    super("play2Scene");
  }

  preload() {
    //load spritesheet
    this.load.spritesheet("explosion", "./assets/explosion.png", {
      frameWidth: 64,
      frameHeight: 32,
      startFrame: 0,
      endFrame: 9,
    });

    //load images/title sprites
    this.load.image("rocket", "./assets/hand.png");
    this.load.image("20", "./assets/20.png");
    this.load.image("50", "./assets/50.png");
    this.load.image("100", "./assets/100.png");
    this.load.image("starfield", "./assets/background.png");
  }

  create() {
    //place tile sprite
    this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);

    //add rocket (p1)
    this.p1Rocket = new Rocket1(this, game.config.width / 2 - 30, 401, "rocket").setOrigin(0, 0);
    this.p2Rocket = new Rocket2(this, game.config.width / 2 + 30, 401, "rocket").setOrigin(0, 0);

    //add spaceship (x4)
    this.ship01 = new Spaceship(this, game.config.width + 192, 82, "20", 0, 20).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width, 135, "50", 0, 50).setScale(0.7).setOrigin(0, 0);
    this.ship03 = new Spaceship(this, game.config.width + 95, 205, "20", 0, 20).setOrigin(0, 0);
    this.ship04 = new Bonus(this, game.config.width, Phaser.Math.Between(90, 200), "100", 0, 100)
      .setScale(0.7)
      .setOrigin(0, 0);

    //define keyboard keys for P1
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    //define keyboard keys for P2
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //score
    this.p1Score = 0;
    this.p2Score = 0;

    //score display
    let scoreConfig = {
      fontFamily: "Courier",
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#6b8cff",
      align: "right",
      padding: {
        top: 5,
        bottom: 5,
      },
    };

    this.score1 = this.add.text(10, 10, "Score1:" + this.p1Score, scoreConfig);
    this.score2 = this.add.text(10, 40, "Score2:" + this.p2Score, scoreConfig);

    //Game flag
    this.gameOver = false;

    //Game time: 60s
    scoreConfig.fixedWidth = 0;
    this.clock = this.time.delayedCall(
      game.settings.gameTimer,
      () => {
        this.add.text(game.config.width / 2, game.config.height / 2 - 20, "GAME OVER", scoreConfig).setOrigin(0.5);
        this.add
          .text(game.config.width / 2, game.config.height / 2 + 64, "Press (F) to Restart or ← to Menu", scoreConfig)
          .setOrigin(0.5);
        this.gameOver = true;
        this.sound.pauseAll();
        this.sound.play('sfx_over');
      },
      null,
      this
    );
  }

  update() {
    //check key input for restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
      this.sound.play('sfx_select');
      this.sound.play('sfx_start');
      this.scene.restart(this.p1Score);
      //this.scene.restart(this.p2Score);
    }
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.sound.play('sfx_select');
      this.scene.start("menuScene");
    }

    //scroll starfield
    this.starfield.tilePositionX -= 0.1; //horizontal

    if (!this.gameOver) {
      //update rocket
      this.p1Rocket.update();
      this.p2Rocket.update();

      //update spaceship*4
      this.ship01.update();
      this.ship02.update();
      this.ship03.update();
      this.ship04.update();
    }

    //check collisions p1
    if (this.checkCollision(this.p1Rocket, this.ship03)) {
      this.p1Rocket.reset();
      this.shipExplode1(this.ship03);
    }
    if (this.checkCollision(this.p1Rocket, this.ship02)) {
      this.p1Rocket.reset();
      this.shipExplode1(this.ship02);
    }
    if (this.checkCollision(this.p1Rocket, this.ship01)) {
      this.p1Rocket.reset();
      this.shipExplode1(this.ship01);
    }
    if (this.checkCollision(this.p1Rocket, this.ship04)) {
      this.p1Rocket.reset();
      this.shipExplode1(this.ship04);
    }
    //check collision p2
    if (this.checkCollision(this.p2Rocket, this.ship03)) {
      this.p2Rocket.reset();
      this.shipExplode2(this.ship03);
    }
    if (this.checkCollision(this.p2Rocket, this.ship02)) {
      this.p2Rocket.reset();
      this.shipExplode2(this.ship02);
    }
    if (this.checkCollision(this.p2Rocket, this.ship01)) {
      this.p2Rocket.reset();
      this.shipExplode2(this.ship01);
    }
    if (this.checkCollision(this.p2Rocket, this.ship04)) {
      this.p2Rocket.reset();
      this.shipExplode2(this.ship04);
    }

    //explosion animation
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 9, first: 0 }),
      frameRate: 30,
    });
  }

  checkCollision(rocket, ship) {
    //simple AABB checking
    if (
      rocket.x < ship.x + ship.width &&
      rocket.x + rocket.width > ship.x &&
      rocket.y < ship.y + ship.height &&
      rocket.height + rocket.y > ship.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  shipExplode1(ship) {
    ship.alpha = 0; //temporarily hide ship
    //create explosion sprite at ship position
    let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
    boom.anims.play("explode"); //play explode animation
    boom.on("animationcomplete", () => {
      //callback after animation completes
      ship.reset(); //reset ship position
      ship.alpha = 1; //make ship visible again
      boom.destroy(); //remove explosion sprite
    });
    //score imcrement and repaint
    this.p1Score += ship.points;
    this.score1.text = "Score1:" + this.p1Score;

    //collision sound
    this.sound.play("sfx_explosion");
  }

  shipExplode2(ship) {
    ship.alpha = 0; //temporarily hide ship
    //create explosion sprite at ship position
    let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
    boom.anims.play("explode"); //play explode animation
    boom.on("animationcomplete", () => {
      //callback after animation completes
      ship.reset(); //reset ship position
      ship.alpha = 1; //make ship visible again
      boom.destroy(); //remove explosion sprite
    });
    //score imcrement and repaint
    this.p2Score += ship.points;
    this.score2.text = "Score2:" + this.p2Score;

    //collision sound
    this.sound.play("sfx_explosion");
  }
}
