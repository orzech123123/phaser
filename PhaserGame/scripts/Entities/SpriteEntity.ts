﻿/// <reference path="KeyEntity.ts" />

class SpriteEntity extends KeyEntity implements IDisposable {
    protected Sprite: Phaser.Sprite;
    public Droped: boolean = true;

    constructor(group: Phaser.Group, x: number, y: number, key: string) {
        super(key);

        this.Sprite = group.create(x, y, key);
        
        this.Sprite.events.onDragStart.add(() => {
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
