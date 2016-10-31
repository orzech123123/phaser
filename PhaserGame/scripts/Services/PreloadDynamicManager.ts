/// <reference path="../typings/jquery.d.ts" />

interface IPreloadDynamicManager {
    RegisterPreloadDynamic(preloadDynamic : IPreloadDynamic);
    PreloadDynamicFor(action : Function);
}

class PreloadDynamicManager implements IPreloadDynamicManager {
    private game: PhaserGame;
    private action: Function;
    private preloadDynamics: Array<IPreloadDynamic>;
    private loaded: number;
    private $loadingScreen : JQuery;
    private $progressbar : JQuery;

    constructor(game : PhaserGame) {
        this.game = game;
        this.preloadDynamics = [];
        this.$loadingScreen = $("#loadingScreen");
        this.$progressbar = $("#progressbar");
        this.$progressbar.progressbar({
            value: 0
        });
    }

    PreloadDynamicFor(action: Function) {
        this.action = action;
        this.loaded = 0;
        this.$progressbar.progressbar({
            value: 0
        });

        this.$loadingScreen.css("display", "table-cell");
        this.game.Phaser.load.onFileComplete.add(() => { this.onFileComplete(); });
        this.game.Phaser.load.onLoadComplete.add(() => { this.onLoadComplete(); });


        for (let i in this.preloadDynamics)
            this.preloadDynamics[i].PreloadDynamic();

        this.game.Phaser.load.start();
    }

    RegisterPreloadDynamic(preloadDynamic: IPreloadDynamic) {
        this.preloadDynamics.push(preloadDynamic);
    }

    private onLoadComplete = () => {
        this.game.Phaser.load.onFileComplete.removeAll();
        this.game.Phaser.load.onLoadComplete.removeAll();

        if (this.action != null) {
            this.action();
            this.action = null;
        }

        this.$loadingScreen.hide();
    }

    private onFileComplete = () => {
        this.loaded++;
        var toLoad = Enumerable.From(this.preloadDynamics).Select(d => d.GetPreloadDynamicCount()).Sum(c => c);

        this.$progressbar.progressbar({
            value: this.loaded / toLoad * 100
        });
    }
}