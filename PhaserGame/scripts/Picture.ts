/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Picture {
    private ttsManager: ITtsManager;
    private key: string;
    private y: number;
    private x: number;
    private sprite : Phaser.Sprite;

    constructor(group : Phaser.Group, x: number, y: number, key: string, ttsManager : ITtsManager) {
        this.ttsManager = ttsManager;
        this.key = key;
        this.y = y;
        this.x = x;

        this.sprite = group.create(this.x, this.y, this.key);
        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag();
        this.sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.sprite, 0.15);
        
        this.sprite.events.onInputDown.add(() => {
            this.ttsManager.PlayAudio(this.key);
        });
    }
}