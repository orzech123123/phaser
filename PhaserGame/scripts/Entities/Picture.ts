class Picture extends SpriteEntity implements ICollidableAndIUpdatable {
    private ttsManager: ITtsManager;
    private hud: PictureHud;

    constructor(group: Phaser.Group, x: number, y: number, key: string, ttsManager: ITtsManager) {
        super(group, x, y, key);

        this.ttsManager = ttsManager;
        
        this.Sprite.inputEnabled = true;
        this.Sprite.input.enableDrag();
        this.Sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.Sprite, 0.1);
        
        this.Sprite.events.onInputDown.add(() => {
            this.ttsManager.PlayAudio(this.Key);
        });
    }

    public EnableHud = (key: string, factory : Phaser.GameObjectFactory) => {
        if (this.hud != null)
            return;

        this.hud = new PictureHud(this, key, factory);
    }

    public Update(): void {
        if (this.hud != null)
            this.hud.Update();

        this.Sprite.tint = 16777215;
    }

    public GetCollidableRect(): Phaser.Rectangle {
        return this.GetRect();
    }

    public Collide(otherCollidable: ICollidable) {
        if (otherCollidable instanceof Box)
            this.Sprite.tint = Math.random() * 0xffffff;
    }
}