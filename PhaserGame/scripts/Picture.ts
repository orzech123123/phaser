/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Picture implements IUpdatable {
    private ttsManager: ITtsManager;
    private key: string;
    private sprite: Phaser.Sprite;

    private hud: PictureHud;

    constructor(group : Phaser.Group, x: number, y: number, key: string, ttsManager : ITtsManager) {
        this.ttsManager = ttsManager;
        this.key = key;

        this.sprite = group.create(x, y, this.key);
        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag();
        this.sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.sprite, 0.1);
        
        this.sprite.events.onInputDown.add(() => {
            this.ttsManager.PlayAudio(this.key);
        });
    }

    public GetSprite = () : Phaser.Sprite => {
        return this.sprite;
    }

    public EnableHud = (key: string, factory : Phaser.GameObjectFactory) => {
        if (this.hud != null)
            return;

        this.hud = new PictureHud(this, key, factory);
    }

    Update(): void {
        if (this.hud != null)
            this.hud.Update();
    }
}