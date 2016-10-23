interface ICreate {
    Create(): void;
}

interface IPreload {
    Preload(): void;
}

interface IPreloadAndICreate extends IPreload, ICreate {
    
}