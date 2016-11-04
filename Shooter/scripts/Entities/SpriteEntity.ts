/// <reference path="KeyEntity.ts" />

class SpriteEntity extends KeyEntity implements IDisposable {
    protected Sprite: Phaser.Sprite;
    public Droped = true;
    public LastDragPosition: Phaser.Point;

    constructor(group: Phaser.Group, x: number, y: number, key: string) {
        super(key);

        this.Sprite = group.create(x, y, key);
        this.LastDragPosition = new Phaser.Point(x, y);
        
        this.Sprite.events.onDragStart.add((sprite) => {
            this.LastDragPosition = new Phaser.Point(sprite.x, sprite.y);
            this.Droped = false;
        });
        this.Sprite.events.onDragStop.add(() => {
            this.Droped = true;
        });
    }

    public GetSprite = (): Phaser.Sprite => {
        return this.Sprite;
    }

    public GetRect = (): Phaser.Rectangle => {
        return SpriteHelper.GetSpriteRectangle(this.Sprite);
    }

    public DestroySprite = () => {
        if (this.Sprite != null)
            this.Sprite.destroy(true);

        this.Sprite = null;
    }

    public Dispose() {
        if (this.Sprite != null)
            this.Sprite.destroy(true);
    }
}
