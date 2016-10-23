/// <reference path="../www/scripts/typings/phaser.d.ts" />

interface IPictureManager extends IPreload {
    GeneratePictures(count: number): void;
}

class PictureManager implements IPictureManager
{
    private game: PhaserGame;
    private imageProvider: IImageProvider;
    private group : Phaser.Group;

    constructor(game: PhaserGame) {
        this.game = game;
        this.imageProvider = new ImageProvider();
    }    
    
    public Preload(): void {
        for (let index in PictureKeys.Keys) {
            let key = PictureKeys.Keys[index];
            this.game.Phaser.load.image(key, this.imageProvider.GetImageUrl(key, "3d"));
        };

        this.game.Phaser.load.image("test", "image/test.png");
    }

    public GeneratePictures(count : number): void {
        if (this.group != null)
            this.group.removeAll(true);

        this.group = this.game.Phaser.add.group();
        this.group.inputEnableChildren = true;
        
        var tempSprite: Phaser.Sprite = this.group.create(0, 0, "test");
        ScreenHelper.ScaleByScreenWidth(tempSprite, 0.15);

        var rectangles = new Array<Phaser.Rectangle>();
        while (rectangles.length < count) {
            let newRectangleX = this.game.Phaser.rnd.integerInRange(0, ScreenHelper.GetScreenWidth() - tempSprite.width);
            let newRectangleY = this.game.Phaser.rnd.integerInRange(0, ScreenHelper.GetScreenHeight() - tempSprite.height);
            let newRectangle = new Phaser.Rectangle(newRectangleX, newRectangleY, tempSprite.width, tempSprite.height);

            let add = true;
            for (let i in rectangles) {
                let rectangle = rectangles[i];
                if (Phaser.Rectangle.intersects(rectangle, newRectangle)) {
                    add = false;
                    break;
                }

                if (!ScreenHelper.GetScreenRectangle().containsRect(newRectangle)) {
                    add = false;
                    break;
                }
            }

            if (add)
                rectangles.push(newRectangle);
        }

        this.group.remove(tempSprite, true);

        for (let i in rectangles) {
            let key = PictureKeys.Keys[this.game.Phaser.rnd.integerInRange(0, PictureKeys.Keys.length - 1)];
            let rectangle = rectangles[i];
            var picture = new Picture(this.group, rectangle.x, rectangle.y, key, this.game.TtsManager);
        }
    }
}