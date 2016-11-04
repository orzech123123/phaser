interface IColidableManager extends IUpdatable {
    RegisterProvider(provider : ICollidableProvider);
    RegisterCollidableListener(listener: ICollidableListener);
}

class CollidableManager implements IColidableManager {
    private providers: Array<ICollidableProvider>;
    private collidableListeners: Array<ICollidableListener>;

    constructor() {
        this.providers = [];
        this.collidableListeners = [];
    }

    public Update(): void {
        var collidables = Enumerable.From<ICollidableProvider>(this.providers)
            .SelectMany(p => p.GetCollidables())
            .ToArray();

        let pairs = new Array<ICollidableTuple>();

        for (var i in collidables) {
            let collidable1 = collidables[i];

            for (var j in collidables) {
                if (i === j)
                    continue;

                let collidable2 = collidables[j];

                if (Phaser.Rectangle.intersects(collidable1.GetCollidableRect(), collidable2.GetCollidableRect())) {
                    collidable1.Collide(collidable2);
                    collidable2.Collide(collidable1);
                    pairs.push({ Collidable1: collidable1, Collidable2: collidable2 });
                }
            }
        }

        for (let i in this.collidableListeners)
            this.collidableListeners[i].CollidablesNotification(pairs);
    }

    public RegisterProvider(provider: ICollidableProvider): void {
        this.providers.push(provider);
    }

    public RegisterCollidableListener = (listener: ICollidableListener) => {
        this.collidableListeners.push(listener);
    }
}

