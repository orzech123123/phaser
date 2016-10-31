/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="./typings/jquery.d.ts" />

class Menu implements ICreate, IUpdatable
{
    private game: PhaserGame;

    private $menuScreen: JQuery;
    private $startButton: JQuery;
    private $quitButton: JQuery;
    
    private spaceKey : Phaser.Key;

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
    }
    
    public Hide = () => {
        this.$menuScreen.hide();

        this.game.Phaser.paused = false;
    }

    public Create(): void {
        this.setBackButton();
    }
    
    private setBackButton = () => {
        if (DeviceHelper.IsWindows()) {
            this.spaceKey = this.game.Phaser.input.keyboard.addKey(Phaser.Keyboard.ESC);
        } else {
            document.addEventListener("backbutton", () => {
               this.onBackButton();
            }, false);
        }
    }

    private onBackButton = () => {
        if (!this.game.Phaser.paused) {
            this.Show();
        } else {
            //window.close();
        }
    }
    
    private onStartButtonClick = () => {
        if (!this.game.Phaser.paused)
            return;
        
        this.game.PreloadDynamicManager.PreloadDynamicFor(() => {
            this.game.Start();
            this.Hide();
        });
    }
    
    private onQuitButtonClick = () => {
        window.close();
    }

    public Update = (): void => {
        if (this.spaceKey != null && this.spaceKey.isDown)
            this.onBackButton();
    }
}