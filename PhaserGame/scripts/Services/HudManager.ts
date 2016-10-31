interface IHudManager extends IPreload {
    GenerateHud(): Array<Phaser.Rectangle>;
    ScorePlus(number : number);
    ScoreMinus(number : number);
}

class HudManager extends GroupEntity implements IHudManager {
    private game: PhaserGame;
    private star: Star;
    private graphics: Phaser.Graphics;
    private scoreText: Phaser.Text;
    private score: number;

    constructor(game : PhaserGame) {
        super("", game.Phaser.add, true);

        this.game = game;
    }

    public Preload(): void {
        this.game.Phaser.load.image("starstar", "images/star.png");
    }

    public GenerateHud(): Array<Phaser.Rectangle> {
        this.RecreateGroup();

        let rectX = ScreenHelper.GetScreenWidth() / 4 * 3;
        let rectY = 0;
        let rectWidth = ScreenHelper.GetScreenWidth() / 4;
        let rectHeight = ScreenHelper.GetScreenHeight() * 0.15;
        this.graphics = this.game.Phaser.add.graphics(rectX, rectY, this.Group);
        this.graphics.beginFill(0x2884FF);
        this.graphics.drawRoundedRect(0, 0, rectWidth, rectHeight, 40);

        this.star = new Star(this.Group, 0, 0, "starstar");
        ScreenHelper.ScaleByScreenHeight(this.star.GetSprite(), 0.15);
        this.star.GetSprite().x = ScreenHelper.GetScreenWidth() - this.star.GetSprite().width;
        this.star.GetSprite().y = 0;

        this.score = 0;
        this.scoreText = this.game.Phaser.add.text(this.star.GetSprite().centerX, this.star.GetSprite().centerY, "0", { font: "65px Arial", fill: "#ff0044", align: "center" });
        this.scoreText.centerX = this.star.GetSprite().centerX;
        this.scoreText.centerY = this.star.GetSprite().centerY;

        return [this.star.GetRect(), new Phaser.Rectangle(rectX, rectY, rectWidth, rectHeight)];
    }

    ScorePlus(number: number) {
        this.score += number;
        this.scoreText.text = String(this.score);
    }

    ScoreMinus(number: number) {
        this.score -= number;
        this.scoreText.text = String(this.score);}
}