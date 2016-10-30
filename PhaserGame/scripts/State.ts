class State implements IUpdatable {
    private game: PhaserGame;
    private keys : Array<string>;
    private onMoveNextActions : Array<Function>;

    constructor(game: PhaserGame) {
        this.game = game;
        this.keys = [];
        this.onMoveNextActions = [];
    }

    public Generate = (count : number) => {
        this.keys = [];

        var keys = PictureKeys.Instance.Keys;
        var generatedKeys = [];

        while (generatedKeys.length < count) {
            var keysMinusGenerated = Enumerable.From(keys).Except(generatedKeys).ToArray();

            var tmpKeys = keysMinusGenerated.length > 0 ? keysMinusGenerated : keys;
            generatedKeys.push(tmpKeys[this.game.Phaser.rnd.integerInRange(0, tmpKeys.length - 1)]);
        }

        this.keys = generatedKeys;
    }
    
    get Keys(): string[] {
        return this.keys;
    }

    get CurrentKey(): string {
        if (this.keys.length === 0)
            return null;

        return this.keys[0];
    }

    public MoveNext = () => {
        if (this.keys.length > 0)
            this.keys.shift();

        for (let i in this.onMoveNextActions)
            this.onMoveNextActions[i]();
    }

    public RegisterOnMoveNext(action: Function) {
        this.onMoveNextActions.push(action);
    }

    Update(): void {}
}