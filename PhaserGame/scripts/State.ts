class State implements IUpdatable, ICollidableListener {
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
            var tmpKey = tmpKeys[this.game.Phaser.rnd.integerInRange(0, tmpKeys.length - 1)];
            if (generatedKeys.length > 1 && tmpKey === generatedKeys[generatedKeys.length - 1])
                continue;

            generatedKeys.push(tmpKey);
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

        this.game.TtsManager.PlayAudio(this.CurrentKey);
    }

    public RegisterOnMoveNext(action: Function) {
        this.onMoveNextActions.push(action);
    }

    Update(): void {}

    CollidablesNotification(pairs: ICollidableTuple[]) {
        var boxDropedPictureCollides = Enumerable.From(pairs)
            .Where(p =>
                (p.Collidable1 instanceof Box && p.Collidable2 instanceof Picture) ||
                (p.Collidable1 instanceof Picture && p.Collidable2 instanceof Box))
            .Select(p => ({
                box: p.Collidable1 instanceof Box ? p.Collidable1 : p.Collidable2,
                picture: p.Collidable1 instanceof Picture ? p.Collidable1 : p.Collidable2
            }))
            .ToArray();

        for (let i in boxDropedPictureCollides) {
            let boxPicture = boxDropedPictureCollides[i];
            var picture = boxPicture.picture as Picture;

            if (picture.Droped) {
                if (picture.Key === this.CurrentKey) {
                    this.game.PictureManager.RemovePicture(picture);
                    this.MoveNext();
                } else {
                    this.game.PictureManager.MovePicture(picture, picture.LastDragPosition);
                }
            }
        }
    }
}