interface IPictureManager extends ICollidableProvider, IPreloadDynamic, IUpdatable {
    GeneratePictures(keys: Array<string>, excludeRects?: Array<Phaser.Rectangle>): void;
    RemovePicture(picture: Picture);
    MovePicture(picture: Picture, point : Phaser.Point);
}

interface IPictureTween {
    Picture: Picture;
    Tween : Phaser.Tween;
}

class PictureManager extends GroupEntity implements IPictureManager
{
    private game: PhaserGame;
    private imageProvider: IImageProvider;
    private pictures: Array<Picture>;

    private tweens: Array<IPictureTween>;
    
    constructor(game: PhaserGame) {
        super("", game.Phaser.add, true);

        this.game = game;
        this.imageProvider = new ImageProvider();
        this.pictures = new Array<Picture>();
        this.tweens = new Array<IPictureTween>();
    }

    public GeneratePictures(keys: Array<string>, excludeRects?: Array<Phaser.Rectangle>): void {
        this.RecreateGroup();

        this.Group.inputEnableChildren = true;
        
        var tempSprite: Phaser.Sprite = this.Group.create(0, 0, "test");
        ScreenHelper.ScaleByScreenWidth(tempSprite, 0.1);

        var rectangles = new Array<Phaser.Rectangle>();
        while (rectangles.length < keys.length) {
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
            let key = keys[i];
            let rectangle = rectangles[i];
            var picture = new Picture(this.Group, rectangle.x, rectangle.y, key);
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

    public GetPreloadDynamicCount(): number {
         return PictureKeys.Instance.Keys.length + 2;
    }
    
    public GetCollidables(): Array<ICollidable> {
        return this.pictures;
    }

    public PreloadDynamic(): void {
        for (let index in PictureKeys.Instance.Keys) {
            let key = PictureKeys.Instance.Keys[index];
            this.game.Phaser.load.image(key, this.imageProvider.GetImageUrl(key, "3d"));
        };

        this.game.Phaser.load.image("test", "images/test.png");
        this.game.Phaser.load.image("pictureHud", "images/pictureHud.png");
    }

    public RemovePicture(picture: Picture) {
        picture.Dispose();

        this.Group.remove(picture.GetSprite(), true);

        if (this.pictures.indexOf(picture) >= 0)
            this.pictures.splice(this.pictures.indexOf(picture), 1);

        if (this.pictures.length === 0 || this.Group.children.length === 0) {
            console.log("---------- END ------------");
        }
    }

    MovePicture(picture: Picture, point: Phaser.Point) {
        if (Enumerable.From(this.tweens).Any(t => t.Picture === picture))
            return;
            
        let tween = this.game.Phaser.add.tween(picture.GetSprite());
        tween.onComplete.add((sprite) => { this.onMoveComplete(sprite); });

        this.tweens.push({ Picture: picture, Tween: tween });

        tween.to({ x: point.x, y: point.y }, 1000/*, Phaser.Easing.Linear.None, true, 0, 0, false*/);
        tween.start();
    }

    private onMoveComplete = (sprite : Phaser.Sprite) => {
        var tween = Enumerable.From(this.tweens)
            .Select((t, i) => ({
                Match: t.Picture.GetSprite() === sprite,
                Picture: t.Picture,
                Index: i
            }))
            .Where(t => t.Match)
            .SingleOrDefault();

        if (tween == null)
            return;
            
        if (tween.Index >= 0)
            this.tweens.splice(tween.Index, 1);
    }
}