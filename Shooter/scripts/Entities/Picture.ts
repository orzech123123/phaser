class Picture extends SpriteEntity implements ICollidable, IUpdatable, IDisposable {
    private hud: PictureHud;

    constructor(group: Phaser.Group, x: number, y: number, key: string, dragAudio?: ExtraMedia, dropAudio?: ExtraMedia) {
        super(group, x, y, key);
        
        this.Sprite.inputEnabled = true;
        this.Sprite.input.enableDrag();
        this.Sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.Sprite, 0.1);
        
        if(dragAudio != null)
            this.Sprite.events.onDragStart.add(() => {
                dragAudio.Replay();;
            });
        if (dropAudio != null)
            this.Sprite.events.onDragStop.add(() => {
                dropAudio.Replay();
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

    public Dispose() {
        if (this.hud != null)
            this.hud.Dispose();

        this.Droped = false;

        super.Dispose();
    }
}