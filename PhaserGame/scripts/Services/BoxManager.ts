interface IBoxManager extends ICollidableProviderAndIPreload {
    GenerateBox() : Phaser.Sprite;
}

class BoxManager extends GroupEntity implements IBoxManager
{
    private game: PhaserGame;
    private box : Box;

    constructor(game: PhaserGame) {
        super("boxbox", game.Phaser.add, false);

         this.game = game;
    }

    public Preload(): void {
        this.game.Phaser.load.image("boxbox", "images/box.png");
    }

    public GenerateBox = () : Phaser.Sprite => {
        this.DestroyGroup();
        this.CreateGroup();

        this.box = new Box(this.Group, 0, 0, this.Key);
        this.box.GetSprite().inputEnabled = true;
        ScreenHelper.ScaleByScreenWidth(this.box.GetSprite(), 0.3);

        this.box.GetSprite().centerX = ScreenHelper.GetScreenWidth() / 2;
        this.box.GetSprite().centerY = ScreenHelper.GetScreenHeight() - this.box.GetSprite().height / 2;

        return this.box.GetSprite();
    }

    GetCollidables(): ICollidable[]
    {
         return [this.box];
    }
}