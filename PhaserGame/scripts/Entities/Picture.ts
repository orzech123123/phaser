class Picture extends SpriteEntity implements ICollidable, IUpdatable, IDisposable {
    private onDropOnBox: Function;
    private hud: PictureHud;

    constructor(group: Phaser.Group, x: number, y: number, key: string, onDropOnBox : Function) {
        super(group, x, y, key);
        
        this.Sprite.inputEnabled = true;
        this.Sprite.input.enableDrag();
        this.Sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.Sprite, 0.1);

        this.onDropOnBox = onDropOnBox;

//        this.Sprite.events.onInputDown.add(() => {
//            this.ttsManager.PlayAudio(this.Key);
//        });
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

        if (otherCollidable instanceof Box && this.Droped) {
            this.onDropOnBox(this);
        }
    }

    public Dispose() {
        if (this.hud != null)
            this.hud.Dispose();

        super.Dispose();
    }
}