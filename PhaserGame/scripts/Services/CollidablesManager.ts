interface IColidableManager extends IUpdatable {
    RegisterProvider(provider : ICollidableProvider);
}

class CollidableManager implements IColidableManager {
    private providers: Array<ICollidableProvider>;

    constructor() {
        this.providers = [];
    }

    public Update(): void {
        var collidables = Enumerable.From<ICollidableProvider>(this.providers)
            .SelectMany(p => p.GetCollidables())
            .ToArray();

        for (var i in collidables) {
            let collidable1 = collidables[i];

            for (var j in collidables) {
                if (i === j)
                    continue;

                let collidable2 = collidables[j];

                if (Phaser.Rectangle.intersects(collidable1.GetCollidableRect(), collidable2.GetCollidableRect())) {
                    collidable1.Collide(collidable2);
                    collidable2.Collide(collidable1);
                }
            }
        }
    }

    public RegisterProvider(provider: ICollidableProvider): void {
        this.providers.push(provider);
    }
}

