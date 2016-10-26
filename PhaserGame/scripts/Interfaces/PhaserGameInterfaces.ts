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


interface ICollidableProviderAndIPreload extends ICollidableProvider, IPreload {

}

interface ICollidableProviderAndIPreloadAndIUpdatable extends ICollidableProviderAndIPreload, IUpdatable {
    
}

interface ICollidableProviderAndIPreloadDynamic extends ICollidableProvider, IPreloadDynamic {

}

interface ICollidableProviderAndIPreloadDynamicAndIUpdatable extends ICollidableProviderAndIPreloadDynamic, IUpdatable {

}

interface ICollidableAndIUpdatable extends ICollidable, IUpdatable {
    
}