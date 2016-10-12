/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="ImageProvider.ts" />

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

        var url = new ImageProvider().GetImageUrl("car");

        this.game.load.image("background", "images/background.jpg");
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
        var test: Phaser.Sprite = group.create(0, 0, "box");
        var testTargetWidth = window.screen.width / 10;
        var scale = testTargetWidth / test.width;
        test.scale.setTo(scale, scale);

        var rectangles = new Array<Phaser.Rectangle>();
        while (rectangles.length < 10) {
            let newRectangle = new Phaser.Rectangle(this.game.rnd.integerInRange(0, window.screen.width), this.game.rnd.integerInRange(0, window.screen.height), test.width, test.height);

            var add = true;
            for (let i in rectangles) {
                let rectangle = rectangles[i];
                if (Phaser.Rectangle.intersects(rectangle, newRectangle)) {
                    add = false;
                    break;
                }

                if (!screenRectangle.containsRect(newRectangle)) {
                    add = false;
                    break;
                }
            }

            if (add)
                rectangles.push(newRectangle);
        }

        group.remove(test, true);

        for (let i in rectangles) {
            let rectangle = rectangles[i];
            let sprite: Phaser.Sprite = group.create(rectangle.x, rectangle.y, "box");
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.input.boundsRect = screenRectangle;
            sprite.scale.setTo(scale, scale);
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
