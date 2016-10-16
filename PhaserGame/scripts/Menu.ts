/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Menu implements IPreloadAndICreate
{
    private game: PhaserGame;
    private group : Phaser.Group;
    private startButton: Phaser.Button;
    private pauseText: Phaser.Text;
    private background : Phaser.Sprite;

    constructor(game: PhaserGame) {
        this.game = game;
    }

    public Show = () => {
        this.game.phaser.paused = true;

        this.startButton.visible = true;
        this.background.visible = true;
        this.pauseText.visible = false;
    }
    
    public Hide = () => {
        this.pauseText.visible = true;
        this.startButton.visible = false;
        this.background.visible = false;

        this.game.phaser.paused = false;
    }

    public Preload(): void {
        this.game.phaser.load.spritesheet("button", "images/start.png", 0, 0);
        this.game.phaser.load.image("menu_background", "images/agibagi.jpg");
    }

    public Create(): void {
        if (this.group != null)
            this.group.removeAll(true);

        this.group = this.game.phaser.add.group();

        this.background = this.game.phaser.add.sprite(0, 0, "menu_background");
        this.background.scale.setTo(ScreenHelper.GetScreenWidth() / this.background.width, ScreenHelper.GetScreenHeight() / this.background.height);
        this.group.add(this.background);

        this.startButton = this.game.phaser.add.button(0, 0, "button", () => {}, this.game.phaser);
        this.startButton.visible = false;
        ScreenHelper.ScaleByScreenHeight(this.startButton, 0.3);
        this.startButton.centerX = ScreenHelper.GetScreenWidth() / 2 + (ScreenHelper.GetScreenWidth() / 4);
        this.startButton.centerY = ScreenHelper.GetScreenHeight() / 4;
        this.group.add(this.startButton);
        
        this.pauseText = this.game.phaser.add.text(0, 0, "Pause", { font: "24px Arial", fill: "#fff" });
        this.pauseText.inputEnabled = true;
        ScreenHelper.ScaleByScreenWidth(this.pauseText, 0.05);
        this.pauseText.x = ScreenHelper.GetScreenWidth() - this.pauseText.width - 10;
        this.pauseText.y += 10;
        this.group.add(this.pauseText);
        
        this.pauseText.events.onInputUp.add(() => {
            this.Create();
            this.Show();
        });
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