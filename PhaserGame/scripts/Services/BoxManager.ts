interface IBoxManager extends IPreload {
    GenerateBox() : Phaser.Sprite;
}

class BoxManager implements IBoxManager
{
    private game: PhaserGame;
    private sprite: Phaser.Sprite;

    constructor(game : PhaserGame) { this.game = game; }

    public Preload(): void {
        this.game.Phaser.load.image("boxbox", "images/box.png");
    }

    public GenerateBox = () : Phaser.Sprite => {
        this.destroyBox();

        this.sprite = this.game.Phaser.add.sprite(0, 0, "boxbox");
        this.sprite.inputEnabled = true;
        ScreenHelper.ScaleByScreenWidth(this.sprite, 0.3);

        this.sprite.centerX = ScreenHelper.GetScreenWidth() / 2;
        this.sprite.centerY = ScreenHelper.GetScreenHeight() - this.sprite.height / 2;

        return this.sprite;
    }

    private destroyBox() {
        if (this.sprite == null)
            return;

        this.sprite.destroy();
        this.sprite = null;
    }
}