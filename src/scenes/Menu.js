class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload(){
        //load Audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_start', './assets/start.mp3');
        this.load.audio('sfx_over', './assets/GameOver.mp3');
        this.load.image("starfield", "./assets/background.png");
    }

    create(){
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);
        
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let scoreConfig = {
            fontFamily: 'Courier',
            color: '#ffffff',
            align: 'right',
        }
        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;
        this.Time = 60000;
        this.add.text(30, 180, 'Money × 20', scoreConfig);
        this.add.text(30, 200, 'Diamonds × 50', scoreConfig);
        this.add.text(30, 220, 'Treasure chest × 100', scoreConfig);
        this.timeText = this.add.text(30, 240, 'Game Time: ' + this.Time/1000 + 's', scoreConfig);

        this.add.text(centerX, centerY-textSpacer*1.5, 'Treasure hunter', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*2, 'Move Mouse to move & Click Mouse to Get', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*2.5, 'Use <- -> & A/D to move Hand For 2-Player Mod', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*3, '(F) & (W) to Get For 2-Player Mod', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY+textSpacer, 'Press <- for Single or -> for Double', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*1.5, 'Press A for Increase or D for Decrease Game Time', menuConfig).setOrigin(0.5);
        
        this.add.text(20, 20, "Treasure hunter Menu");

        // launch the next scene
        //this.scene.start("playScene");

         //define keyboard keys
         keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
         keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
         keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
         keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update(){
        //Single
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
            game.settings = {
                spaceshipSpeed: 3,
                bonusSpeed: 5.5,
                gameTimer: this.Time
            }
            this.sound.play('sfx_select');
            this.sound.play('sfx_start');
            this.scene.start("play1Scene");
        }
        //Double
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            game.settings = {
                spaceshipSpeed: 3,
                bonusSpeed: 5.5,
                gameTimer: this.Time
            }
            this.sound.play('sfx_select');
            this.sound.play('sfx_start');
            this.scene.start("play2Scene");
        }
        //Increase Game Time
        if(Phaser.Input.Keyboard.JustDown(keyA)){
            if(this.Time < 90000) this.increase();
        }
        //Decrease Game Time
        if(Phaser.Input.Keyboard.JustDown(keyD)){
            if(this.Time > 30000) this.decrease();
        }
    }
    increase() {
        if(this.Time < 90000) {
            this.Time += 10000;
            this.timeText.text = 'Game Time: ' + this.Time/1000 + 's';
        }
    }
    decrease() {
        if(this.Time > 30000) {
            this.Time -= 10000;
            this.timeText.text = 'Game Time: ' + this.Time/1000 + 's';
        }
    }
}