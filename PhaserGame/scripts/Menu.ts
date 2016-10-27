/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="./typings/jquery.d.ts" />

class Menu implements ICreate
{
    private game: PhaserGame;
    private group: Phaser.Group;
    private menuButton: Phaser.Text;

    private $menuScreen: JQuery;
    private $startButton: JQuery;
    private $quitButton: JQuery;

    constructor(game: PhaserGame) {
        this.game = game;

        this.$menuScreen = $("#menuScreen");

        this.$startButton = $("#startButton");
        this.$startButton.on("click", () => { this.onStartButtonClick(); });

        this.$quitButton = $("#quitButton");
        this.$quitButton.on("click", () => { this.onQuitButtonClick(); });
    }

    public Show = () => {
        this.game.Phaser.paused = true;
        
        this.$menuScreen.show();

        if (this.menuButton != null)
            this.menuButton.visible = false;
    }
    
    public Hide = () => {
        if (this.menuButton != null)
            this.menuButton.visible = true;

        this.$menuScreen.hide();

        this.game.Phaser.paused = false;
    }

    public Create(): void {
        this.trySetOnBackbutton();
        this.createInternal();
    }
    
    private trySetOnBackbutton = () => {
        if (DeviceHelper.IsWindows())
            return;

        document.addEventListener("backbutton", () => {
            if (!this.game.Phaser.paused) {
                this.createInternal();
                this.Show();
            } else {
                //window.close();
            }
        }, false);
    }

    private createInternal = () => {
        if (this.group != null)
            this.group.destroy(true);

        this.group = this.game.Phaser.add.group();
        
        if (DeviceHelper.IsWindows()) {
            this.menuButton = this.game.Phaser.add.text(0, 0, "Menu", { font: "24px Arial", fill: "#fff" });
            this.menuButton.inputEnabled = true;
            ScreenHelper.ScaleByScreenWidth(this.menuButton, 0.05);
            this.menuButton.x = ScreenHelper.GetScreenWidth() - this.menuButton.width - 10;
            this.menuButton.y += 10;
            this.group.add(this.menuButton);
            this.menuButton.events.onInputUp.add(() => {
                this.createInternal();
                this.Show();
            });
        }
    }
    
    private onStartButtonClick = () => {
        if (!this.game.Phaser.paused)
            return;
        
        this.game.PreloadDynamicManager.PreloadDynamicFor(() => {
            this.Hide();
            this.game.Start();
        });
    }
    
    private onQuitButtonClick = () => {
        window.close();
    }
}