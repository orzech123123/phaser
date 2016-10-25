interface IPictureManager extends ICollidableProviderAndIPreloadAndIUpdatable {
    GeneratePictures(count: number, excludeRects? : Array<Phaser.Rectangle>): void;
}

class PictureManager extends GroupEntity implements IPictureManager
{
    private game: PhaserGame;
    private imageProvider: IImageProvider;
    private pictures : Array<Picture>;

    constructor(game: PhaserGame) {
        super("", game.Phaser.add, true);

        this.game = game;
        this.imageProvider = new ImageProvider();
        this.pictures = new Array<Picture>();
    }

    public GetCollidables(): Array<ICollidable> {
        return this.pictures;
    }
    
    public Preload(): void {
        for (let index in PictureKeys.Instance.Keys) {
            let key = PictureKeys.Instance.Keys[index];
            this.game.Phaser.load.image(key, this.imageProvider.GetImageUrl(key, "3d"));
        };

        this.game.Phaser.load.image("test", "images/test.png");
        this.game.Phaser.load.image("pictureHud", "images/pictureHud.png");
    }

    public GeneratePictures(count: number, excludeRects?: Array<Phaser.Rectangle>): void {
        this.DestroyGroup();
        this.CreateGroup();

        this.Group.inputEnableChildren = true;
        
        var tempSprite: Phaser.Sprite = this.Group.create(0, 0, "test");
        ScreenHelper.ScaleByScreenWidth(tempSprite, 0.1);

        var rectangles = new Array<Phaser.Rectangle>();
        while (rectangles.length < count) {
            let newRectangleX = this.game.Phaser.rnd.integerInRange(0, ScreenHelper.GetScreenWidth() - tempSprite.width);
            let newRectangleY = this.game.Phaser.rnd.integerInRange(0, ScreenHelper.GetScreenHeight() - tempSprite.height);
            let newRectangle = new Phaser.Rectangle(newRectangleX, newRectangleY, tempSprite.width, tempSprite.height);

            let add = true;

            add = this.tryAddRect(rectangles, newRectangle) &&
                 (excludeRects == null || this.tryAddRect(excludeRects, newRectangle));

            if (add)
                rectangles.push(newRectangle);
        }

        this.Group.remove(tempSprite, true);

        this.pictures = [];

        for (let i in rectangles) {
            let key = PictureKeys.Instance.Keys[this.game.Phaser.rnd.integerInRange(0, PictureKeys.Instance.Keys.length - 1)];
            let rectangle = rectangles[i];
            var picture = new Picture(this.Group, rectangle.x, rectangle.y, key, this.game.TtsManager);
            this.pictures.push(picture);
            picture.EnableHud("pictureHud", this.game.Phaser.add);
        }
    }

    private tryAddRect = (rectangles: Array<Phaser.Rectangle>, newRectangle: Phaser.Rectangle): boolean => {
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

        return add;
    }

    public Update = (): void => {
        if (this.pictures != null) {
            for (let i in this.pictures) {
                this.pictures[i].Update();
            }
        }
    }
}