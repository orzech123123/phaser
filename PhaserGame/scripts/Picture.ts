/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Picture implements IUpdatable {
    private objectFactory: Phaser.Game; 
    private ttsManager: ITtsManager;
    private key: string;
    private y: number;
    private x: number;
    private sprite: Phaser.Sprite;

    private hudKey: string;
    private hudGroup: Phaser.Group;

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

        this.sprite.events.onDragStart.add(() => { this.hudDragStart(); });
        this.sprite.events.onDragStop.add(() => { this.hudDragStop(); });
        
        this.sprite.events.onInputDown.add(() => {
            this.ttsManager.PlayAudio(this.key);
        });
    }

    public EnableHud = (key: string, factory : Phaser.Game) => {
        this.hudKey = key;
        this.objectFactory = factory;
    }

    private hudDragStart = () => {
        if (!this.hudKey || !this.objectFactory)
            return;

        if (this.hudGroup != null)
            this.hudGroup.removeAll(true);
            
        this.hudGroup = this.objectFactory.add.group();

        let hudSprite = this.hudGroup.create(this.x, this.y, this.hudKey);
        ScreenHelper.ScaleByScreenWidth(hudSprite, 0.05);
    }

    private hudDragStop = () => {
        this.hudGroup.removeAll(true);
    }

    public Update(): void {
        if (!!this.hudGroup) {
//            for (let i in this.hudGroup.children) {
//                let hudSprite = this.hudGroup.children[i];
//                hudSprite.x = this.x;
//                hudSprite.y = this.y;
//            }
            this.hudGroup.forEachAlive((hudSprite) => {
                hudSprite.x = 50;//this.x;
                hudSprite.y = 50;//this.y;
            }, this.objectFactory);

        }
    }
}