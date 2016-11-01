interface IState extends IUpdatable, ICollidableListener  {
    Generate(count: number);
    Start();
    RegisterOnStart(action: Function);
    RegisterOnFinish(action: Function);
    RegisterOnMoveNext(action: Function);
    RegisterOnValidAnswer(action: Function);
    RegisterOnInvalidAnswer(action: Function);
    Keys(): string[];
    CurrentKey(): string;
}

class State implements IState {
    private game: PhaserGame;
    private keys : Array<string>;
    private onMoveNextActions : Array<Function>;
    private onValidAnswerActions : Array<Function>;
    private onInvalidAnswerActions: Array<Function>;
    private onStartActions: Array<Function>;
    private onFinishActions: Array<Function>;
    private isStarted = false;
    private score = 0;

    constructor(game: PhaserGame) {
        this.game = game;
        this.keys = [];
        this.onMoveNextActions = [];
        this.onValidAnswerActions = [];
        this.onInvalidAnswerActions = [];
        this.onStartActions = [];
        this.onFinishActions = [];
    }

    public Generate = (count: number) => {
        this.isStarted = false;
        this.keys = [];
        this.score = 0;

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
    
    public Keys(): string[] {
        return this.keys;
    }

    public CurrentKey(): string {
        if (this.keys.length === 0)
            return null;

        return this.keys[0];
    }

    private moveNext = () => {
        if (this.keys.length > 0)
            this.keys.shift();
        
        if (this.keys.length === 0) {
            for (let i in this.onFinishActions)
                this.onFinishActions[i](this.score);

            return;
        }
        

        for (let i in this.onMoveNextActions)
            this.onMoveNextActions[i](this.CurrentKey());
    }

    public RegisterOnMoveNext(action: Function) {
        this.onMoveNextActions.push(action);
    }

    public RegisterOnValidAnswer(action: Function) {
        this.onValidAnswerActions.push(action);
    }

    public RegisterOnInvalidAnswer(action: Function) {
        this.onInvalidAnswerActions.push(action);
    }
    
    public RegisterOnStart(action: Function) {
        this.onStartActions.push(action);
    }

    public RegisterOnFinish(action: Function) {
        this.onFinishActions.push(action);
    }

    Update(): void {}

    CollidablesNotification(pairs: ICollidableTuple[]) {
        var boxPictureCollides = Enumerable.From(pairs)
            .Where(p =>
                (p.Collidable1 instanceof Box && p.Collidable2 instanceof Picture) ||
                (p.Collidable1 instanceof Picture && p.Collidable2 instanceof Box))
            .Select(p => ({
                box: p.Collidable1 instanceof Box ? p.Collidable1 : p.Collidable2,
                picture: p.Collidable1 instanceof Picture ? p.Collidable1 : p.Collidable2
            }))
            .ToArray();

        for (let i in boxPictureCollides) {
            let boxPicture = boxPictureCollides[i];
            var picture = boxPicture.picture as Picture;

            if (picture.Droped) {
                if (picture.Key === this.CurrentKey()) {
                    this.score++;

                    for (let j in this.onValidAnswerActions)
                        this.onValidAnswerActions[j](picture, this.score);
                        
                    this.moveNext();
                } else {
                    this.score--;

                    for (let k in this.onInvalidAnswerActions)
                        this.onInvalidAnswerActions[k](picture, this.score);
                }
            }
        }
    }

    public Start() {
        if (this.isStarted)
            return;
            
        for (let i in this.onStartActions)
            this.onStartActions[i](this.CurrentKey());

        this.isStarted = true;
    }
}