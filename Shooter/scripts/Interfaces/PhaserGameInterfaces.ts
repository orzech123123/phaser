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

interface ICollidableTuple {
    Collidable1 : ICollidable;   
    Collidable2 : ICollidable;  
}

interface ICollidableListener {
    CollidablesNotification(pairs : Array<ICollidableTuple>)
}