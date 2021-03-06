//Rocket prefabs
class Rocket2 extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        scene.add.existing(this);  //add object to existing, displayList, updateList
        this.isFiring = false;  //track rocket's firing status

        this.sfxRocket = scene.sound.add('sfx_rocket');  //add rocket sfx
    }

    update(){
        //A/right movement
        if(keyA.isDown && this.x >= 47){
            this.x -= 2;
        }else if(keyD.isDown && this.x <= 578){
            this.x += 2;
        }
        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyW) && !this.isFiring){
            this.isFiring = true;
            this.sfxRocket.play();  //fire sound
        }
        //if fired, move up
        if(this.isFiring && this.y >= 40){
            this.y -= 2;
        }
        //reset on miss
        if(this.y <= 40){
            this.reset();
        }
    }
    
    //reset the rocket
    reset(){
            this.isFiring = false;
            this.y = 401;
    }
}