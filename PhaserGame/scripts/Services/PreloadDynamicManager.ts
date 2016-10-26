interface IPreloadDynamicManager {
    RegisterPreloadDynamic(preloadDynamic : IPreloadDynamic);
    PreloadDynamicFor(action : Function);
}

class PreloadDynamicManager implements IPreloadDynamicManager {
    private game: PhaserGame;
    private action: Function;
    private preloadDynamics: Array<IPreloadDynamic>;

    constructor(game : PhaserGame) {
        this.game = game;
        this.preloadDynamics = [];
    }

    PreloadDynamicFor(action: Function) {
        this.action = action;

        this.game.Phaser.load.onLoadComplete.add(() => { this.onLoadComplete(); });

        for (let i in this.preloadDynamics)
            this.preloadDynamics[i].PreloadDynamic();

        this.game.Phaser.load.start();
    }

    RegisterPreloadDynamic(preloadDynamic: IPreloadDynamic) {
        this.preloadDynamics.push(preloadDynamic);
    }

    public onLoadComplete = () => {
        this.game.Phaser.load.onLoadComplete.removeAll();

        if (this.action != null) {
            this.action();
            this.action = null;
        }
    }
}