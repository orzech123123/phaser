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
        var json_obj = JSON.parse(this.Get("http://testapi.bigstockphoto.com/2/883610/search/?q=dog"));

        var images = new Array<string>();
        for (var i in json_obj.data.images) {
            var image = json_obj.data.images[i].small_thumb.url;
            images.push(image);
        }

        this.game.load.image("background", "images/background.jpg");
        //this.game.load.image("box", "images/box.jpg");
        this.game.load.image("box", images[0]);
    }

    create = () => {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.background = new MySprite(this.game.add.sprite(0, 0, "background"));
        this.background.object.inputEnabled = true;
        this.background.object.scale.setTo(window.screen.width / this.background.object.width, window.screen.height / this.background.object.height);

        var group = this.game.add.group();
        group.inputEnableChildren = true;

        var screenRectangle = new Phaser.Rectangle(0, 0, window.screen.width, window.screen.height);
        for (let i = 0; i < 3; i++) {
            var added = false;
            while (!added) {
                var addFailed = false;
                var sprite : Phaser.Sprite = group.create(this.game.rnd.integerInRange(0, window.screen.width), this.game.rnd.integerInRange(0, window.screen.height), "box");
                sprite.inputEnabled = true;
                sprite.input.enableDrag();
                sprite.input.boundsRect = screenRectangle;

                var children = group.children as Array<Phaser.Sprite>;
                for (let j in children) {
                    var child = children[j];
                    if (child === sprite)
                        continue;
                        
                    var childRectangle = new Phaser.Rectangle(child.x, child.y, child.width, child.height);
                    var spriteRectangle = new Phaser.Rectangle(sprite.x, sprite.y, child.width, child.height);
                    
                    if (Phaser.Rectangle.intersects(childRectangle, spriteRectangle)) {
                        console.log("AddFail: intersects");
                        group.remove(sprite, true);
                        addFailed = true;
                        break;
                    }
                        
                    if (!screenRectangle.containsRect(spriteRectangle)) {
                        console.log("AddFail: !containsRect");
                        group.remove(sprite, true);
                        addFailed = true;
                        break;
                    }
                }

                if (!addFailed)
                    added = true;
            }
        }

//        sonic.events.onDragStart.add(() => { this.onDragStart(); }, this);
//        sonic.events.onDragStop.add(() => { this.onDragStop(); }, this);
//
//        group.onChildInputDown.add(() => { this.onDown(); }, this);


        //var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
        var musicFile = new Media("file:///android_asset/www/audio/theme.mp3", null, null);
        //var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
        musicFile.play();
    }

    private Get = (yourUrl) => {
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET", yourUrl, false);
        Httpreq.send(null);
        return Httpreq.responseText;

    }

    render = () => {
    }
    
    update = () => {
    }
}
