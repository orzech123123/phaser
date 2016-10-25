interface ICollidableProvider {
    GetCollidables() : Array<ICollidable>;
}

interface ICollidable {
    GetCollidableRect(): Phaser.Rectangle;
    Collide(otherCollidable : ICollidable);
}

interface ICollidableProviderAndIPreload extends ICollidableProvider, IPreload {

}

interface ICollidableProviderAndIPreloadAndIUpdatable extends ICollidableProviderAndIPreload, IUpdatable {
    
}

interface ICollidableAndIUpdatable extends ICollidable, IUpdatable {
    
}