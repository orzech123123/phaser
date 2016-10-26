/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Menu implements IPreloadAndICreate
{
    private game: PhaserGame;
    private group : Phaser.Group;
    private startButton: Phaser.Button;
    private menuText: Phaser.Text;
    private background : Phaser.Sprite;

    constructor(game: PhaserGame) {
        this.game = game;
    }

    public Show = () => {
        this.game.Phaser.paused = true;

        this.startButton.visible = true;
        this.background.visible = true;

        if (!device || !device.platform || device.platform === "windows") {
            this.menuText.visible = false;
        }
    }
    
    public Hide = () => {
        if (!device || !device.platform || device.platform === "windows") {
            this.menuText.visible = true;
        }

        this.startButton.visible = false;
        this.background.visible = false;

        this.game.Phaser.paused = false;
    }

    public Preload(): void {
        this.game.Phaser.load.spritesheet("menuStart", "images/menuStart.png", 0, 0);
        this.game.Phaser.load.image("menuBackground", "images/menuBackground.jpg");
    }

    public Create(): void {
        this.trySetOnBackbutton();
        this.createInternal();
    }
    
    private trySetOnBackbutton = () => {
        if (!device || !device.platform || device.platform === "windows")
            return;

        document.addEventListener("backbutton", () => {
            if (!this.game.Phaser.paused) {
                this.createInternal();
                this.Show();
            } else {
                window.close();
            }
        }, false);
    }

    private createInternal = () => {
        if (this.group != null)
            this.group.destroy(true);

        this.group = this.game.Phaser.add.group();

        this.background = this.game.Phaser.add.sprite(0, 0, "menuBackground");
        this.background.scale.setTo(ScreenHelper.GetScreenWidth() / this.background.width, ScreenHelper.GetScreenHeight() / this.background.height);
        this.group.add(this.background);

        this.startButton = this.game.Phaser.add.button(0, 0, "menuStart", () => { }, this.game.Phaser);
        this.startButton.visible = false;
        ScreenHelper.ScaleByScreenHeight(this.startButton, 0.3);
        this.startButton.centerX = ScreenHelper.GetScreenWidth() / 2 + (ScreenHelper.GetScreenWidth() / 4);
        this.startButton.centerY = ScreenHelper.GetScreenHeight() / 4;
        this.group.add(this.startButton);

        if (!device || !device.platform || device.platform === "windows") {
            this.menuText = this.game.Phaser.add.text(0, 0, "Menu", { font: "24px Arial", fill: "#fff" });
            this.menuText.inputEnabled = true;
            ScreenHelper.ScaleByScreenWidth(this.menuText, 0.05);
            this.menuText.x = ScreenHelper.GetScreenWidth() - this.menuText.width - 10;
            this.menuText.y += 10;
            this.group.add(this.menuText);
            this.menuText.events.onInputUp.add(() => {
                this.createInternal();
                this.Show();
            });
        }

        this.game.Phaser.input.onDown.add(() => { this.onScreenClick(); }, this.game.Phaser);
    }
    
    private onScreenClick = () => {
        if (!this.game.Phaser.paused)
            return;

        var startButtonRect = new Phaser.Rectangle(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);
        if (!startButtonRect.contains(this.game.Phaser.input.x, this.game.Phaser.input.y) && this.game.Phaser.input.x > 0 && this.game.Phaser.input.y > 0)
            return;
            
        this.game.PreloadDynamicManager.PreloadDynamicFor(() => {
            this.Hide();
            this.game.Start();
        });
    }
}