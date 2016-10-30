interface ICollidableProvider {
    GetCollidables() : Array<ICollidable>;
}

interface ICollidable {
    GetCollidableRect(): Phaser.Rectangle;
    Collide(otherCollidable : ICollidable);
}

interface IPreloadDynamic {
    GetPreloadDynamicCount() : number;
    PreloadDynamic();
}

interface IDisposable {
    Dispose();
}