/// <reference path="KeyEntity.ts" />

class SpriteEntity extends KeyEntity {
    protected Sprite: Phaser.Sprite;

    constructor(group: Phaser.Group, x: number, y: number, key: string) {
        super(key);

        this.Sprite = group.create(x, y, key);
        //this.Sprite.loadTexture(key);
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
}
