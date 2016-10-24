interface ICreate {
    Create(): void;
}

interface IPreload {
    Preload(): void;
}

interface IUpdatable {
    Update(): void;
}

interface IPreloadAndICreate extends IPreload, ICreate {
    
}

interface IPreloadAndIUpdatable extends IPreload, IUpdatable {

}