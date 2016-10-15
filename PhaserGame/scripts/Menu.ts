/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Menu implements IPreloadAndICreate
{
    private game: PhaserGame;
    private startButton : Phaser.Button;
    private pauseText : Phaser.Text;

    constructor(game: PhaserGame) {
        this.game = game;
    }

    public Show = () => {
        this.game.phaser.paused = true;
        this.startButton.visible = true;
        this.pauseText.visible = false;
    }
    
    public Hide = () => {
        this.pauseText.visible = true;
        this.startButton.visible = false;
        this.game.phaser.paused = false;
    }

    public Preload(): void {
        this.game.phaser.load.spritesheet("button", "http://www.clker.com/cliparts/t/2/J/p/t/d/start-button-png-hi.png", 0, 0);
    }

    public Create(): void {
        this.startButton = this.game.phaser.add.button(0, 0, "button", () => {}, this.game.phaser);
        this.startButton.visible = false;
        ScreenHelper.ScaleByScreenWidth(this.startButton, 0.3);
        this.startButton.centerX = ScreenHelper.GetScreenWidth() / 2;
        this.startButton.centerY = ScreenHelper.GetScreenHeight() / 2;
        
        this.pauseText = this.game.phaser.add.text(0, 0, "Pause", { font: "24px Arial", fill: "#fff" });
        this.pauseText.inputEnabled = true;
        ScreenHelper.ScaleByScreenWidth(this.pauseText, 0.05);
        this.pauseText.x = ScreenHelper.GetScreenWidth() - this.pauseText.width - 10;
        this.pauseText.y += 10;
        
        this.pauseText.events.onInputUp.add(() => { this.Show(); });
        this.game.phaser.input.onDown.add(() => { this.onScreenClick(); }, this.game.phaser);
    }
    
    private onScreenClick = () => {
        if (!this.game.phaser.paused)
            return;

        var startButtonRect = new Phaser.Rectangle(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);
        if (!startButtonRect.contains(this.game.phaser.input.x, this.game.phaser.input.y) && this.game.phaser.input.x > 0 && this.game.phaser.input.y > 0)
            return;

        this.Hide();
        this.game.Start();
    }
}