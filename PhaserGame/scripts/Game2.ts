/// <reference path="../www/scripts/typings/phaser.d.ts" />

interface ICustomParams {
    health?: number;
    fun?: number;
}

class MySprite {
    constructor(object: Phaser.Sprite) {
        this.object = object;
    }

    customParams: ICustomParams;
    object: Phaser.Sprite;
}

class PhaserGame {
    private game: Phaser.Game;
    private background: MySprite;
    
    private boxSprite : Phaser.Sprite;

    constructor() {
        this.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO, "content", { preload: () => { this.preload(); }, create: () => { this.create(); }, update: () => { this.update(); }, render: () => { this.render(); } });
    }
    
    preload() {
        this.game.load.image("background", "images/background.jpg");
        this.game.load.image("box", "images/box.jpg");
    }

    create = () => {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.background = new MySprite(this.game.add.sprite(0, 0, "background"));
        this.background.object.inputEnabled = true;
        //this.background.object.events.onInputDown.add((sprite, event) => { this.placeItem(sprite, event); }, this);
        this.background.object.scale.setTo(window.screen.width / this.background.object.width, window.screen.height / this.background.object.height);
            
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = "#0072bc";

        this.boxSprite = this.game.add.sprite(200, 200, "box");
        this.boxSprite.anchor.setTo(0.5, 0.5);
        this.boxSprite.scale.set(0.5, 0.5);

        //  Enable Arcade Physics for the sprite
        this.game.physics.enable(this.boxSprite, Phaser.Physics.ARCADE);

        //  Tell it we don't want physics to manage the rotation
        this.boxSprite.body.allowRotation = false;

        //var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
        //var musicFile = new Media("file:///android_asset/www/audio/theme.mp3", null, null);
        var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
        musicFile.play();
    }

    render = () => {
        //this.game.debug.spriteInfo(this.boxSprite, 32, 32);
    }
    
    update = () => {
        this.boxSprite.rotation = this.game.physics.arcade.moveToPointer(this.boxSprite, 60, this.game.input.activePointer, 500);
    }
}
