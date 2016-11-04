interface IHudManager extends IPreload {
    GenerateHud(): Array<Phaser.Rectangle>;
    SetScore(number : number);
    SetPictureName(name : string);
}

class HudManager extends GroupEntity implements IHudManager {
    private game: PhaserGame;
    private star: Star;
    private graphics: Phaser.Graphics;
    private scoreText: Phaser.Text;
    private pictureNameText: Phaser.Text;
    
    private fontSize = DeviceHelper.IsWindows() ? "32px" : "22px"; 

    constructor(game : PhaserGame) {
        super("", game.Phaser.add, true);

        this.game = game;
    }

    public Preload(): void {
        this.game.Phaser.load.image("starstar", "images/star.png");
    }

    public GenerateHud(): Array<Phaser.Rectangle> {
        this.RecreateGroup();

        let font = "bold " + this.fontSize + " Arial";
        let margin = ScreenHelper.GetScreenHeight() / 20;
        
        this.star = new Star(this.Group, 0, 0, "starstar");
        ScreenHelper.ScaleByScreenHeight(this.star.GetSprite(), 0.125);
        this.star.GetSprite().centerX = (ScreenHelper.GetScreenWidth() - this.star.GetSprite().width / 2) - margin;
        this.star.GetSprite().centerY = (this.star.GetSprite().height / 2) + margin;
        
        this.scoreText = this.game.Phaser.add.text(this.star.GetSprite().centerX, this.star.GetSprite().centerY, "0", { font: font, fill: "white", align: "left" }, this.Group);
        this.scoreText.centerX = this.star.GetSprite().centerX;
        this.scoreText.centerY = this.star.GetSprite().centerY + this.star.GetSprite().height / 10;

        this.pictureNameText = this.game.Phaser.add.text(
            0 + margin, 0 + margin, "", { font: font, fill: "white", wordWrap: true, wordWrapWidth: ScreenHelper.GetScreenWidth() / 4, align: "center", backgroundColor: "#053272" }, this.Group);

        return [this.star.GetRect(), new Phaser.Rectangle(this.pictureNameText.x, this.pictureNameText.y, this.pictureNameText.width, this.pictureNameText.height)];
    }

    SetScore(number: number) {
        this.scoreText.text = String(number);
    }

    SetPictureName(name: string) {
        this.pictureNameText.text = name != null ? name.toUpperCase() : "";
    }
}