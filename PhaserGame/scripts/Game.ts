/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="ImageProvider.ts" />


class PhaserGame {
    public phaser: Phaser.Game;
    private imageProvider: IImageProvider;
    private menu: Menu;

    private background: Phaser.Sprite;
    private group : Phaser.Group;

    constructor() {
        this.imageProvider = new ImageProvider();
        this.menu = new Menu(this);

        this.phaser = new Phaser.Game(ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight(), Phaser.AUTO, "content", { preload: () => { this.preload(); }, create: () => { this.create(); }, update: () => { this.update(); }, render: () => { this.render(); } });
    }
    
    public Start() {
        if (this.group != null)
            this.group.removeAll(true);

        this.group = this.phaser.add.group();
        this.group.inputEnableChildren = true;

        var screenRectangle = new Phaser.Rectangle(0, 0, ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight());
        var test: Phaser.Sprite = this.group.create(0, 0, "sprite");
        ScreenHelper.ScaleByScreenWidth(test, 0.1);

        var rectangles = new Array<Phaser.Rectangle>();
        while (rectangles.length < 10) {
            let newRectangle = new Phaser.Rectangle(this.phaser.rnd.integerInRange(0, ScreenHelper.GetScreenWidth()), this.phaser.rnd.integerInRange(0, ScreenHelper.GetScreenHeight()), test.width, test.height);

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

        this.group.remove(test, true);

        for (let i in rectangles) {
            let rectangle = rectangles[i];
            let sprite: Phaser.Sprite = this.group.create(rectangle.x, rectangle.y, "sprite");
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.input.boundsRect = screenRectangle;
            ScreenHelper.ScaleByScreenWidth(sprite, 0.1);
        }
    }
    
    preload = () => {
        this.phaser.load.image("background", "images/background.jpg");
        this.menu.Preload();

        this.phaser.load.image("sprite", this.imageProvider.GetImageUrl("dog"));
    }

    create = () => {
        this.phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.background = this.phaser.add.sprite(0, 0, "background");
        this.background.inputEnabled = true;
        this.background.scale.setTo(ScreenHelper.GetScreenWidth() / this.background.width, ScreenHelper.GetScreenHeight() / this.background.height);
        

        this.menu.Create();


        //var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
        var musicFile = new Media("file:///android_asset/www/audio/agibagi.mp3", null, null);
        //var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
        musicFile.play();
        
        this.menu.Show();
    }

    render = () => {
    }
    
    update = () => {
    }
}
