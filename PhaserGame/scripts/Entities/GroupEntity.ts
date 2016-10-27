/// <reference path="KeyEntity.ts" />

class GroupEntity extends KeyEntity {
    protected Group : Phaser.Group;
    protected ObjectFactory: Phaser.GameObjectFactory;

    constructor(key : string, objectFactory : Phaser.GameObjectFactory, lazyGroupInit : boolean) {
        super(key);
        
        this.ObjectFactory = objectFactory;

        if(!lazyGroupInit)
            this.Group = objectFactory.group();
    }
    
    public DestroyGroup = () => {
        if (this.Group != null)
            this.Group.destroy(true);

        this.Group = null;
    }


    public CreateGroup = () => {
        if (this.Group != null)
            return;

        this.Group = this.ObjectFactory.group();
    }

    public RecreateGroup = () => {
        this.DestroyGroup();
        this.CreateGroup();
    }
}