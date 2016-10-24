/// <reference path="../www/scripts/typings/phaser.d.ts" />

class Picture implements IUpdatable {
    private objectFactory: Phaser.GameObjectFactory; 
    private ttsManager: ITtsManager;
    private key: string;
    private sprite: Phaser.Sprite;

    private hudKey: string;
    private hudGroup: Phaser.Group;

    constructor(group : Phaser.Group, x: number, y: number, key: string, ttsManager : ITtsManager) {
        this.ttsManager = ttsManager;
        this.key = key;

        this.sprite = group.create(x, y, this.key);
        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag();
        this.sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.sprite, 0.1);

        this.sprite.events.onDragStart.add(() => { this.hudDragStart(); });
        this.sprite.events.onDragStop.add(() => { this.hudDragStop(); });
        
        this.sprite.events.onInputDown.add(() => {
            this.ttsManager.PlayAudio(this.key);
        });
    }

    public EnableHud = (key: string, factory : Phaser.GameObjectFactory) => {
        this.hudKey = key;
        this.objectFactory = factory;
    }

    private hudDragStart = () => {
        if (!this.hudKey || !this.objectFactory)
            return;

        if (this.hudGroup != null)
            this.hudGroup.removeAll(true);
            
        this.hudGroup = this.objectFactory.group();

        let r = Math.sqrt(Math.pow(this.sprite.width / 2, 2) + Math.pow(this.sprite.height / 2, 2));
        
        let counter = 10; 
        for (let i = 0; i < 2 * 3.14; i += 0.01) {
            counter++;

            if (counter % 30 !== 0)
                continue;    
                
            let hudSprite = this.hudGroup.create(this.sprite.x, this.sprite.y, this.hudKey);
            ScreenHelper.ScaleByScreenWidth(hudSprite, 0.01);
            hudSprite.centerX = this.sprite.centerX + r * Math.cos(i);
            hudSprite.centerY = this.sprite.centerY + r * Math.sin(i);
        }
    }

    private hudDragStop = () => {
        this.hudGroup.removeAll(true);
    }

    public Update(): void {
        if (!!this.hudGroup) {
            this.hudGroup.centerX = this.sprite.centerX;
            this.hudGroup.centerY = this.sprite.centerY;

//            let r = Math.sqrt(Math.pow(this.sprite.width / 2, 2) + Math.pow(this.sprite.height / 2, 2));
//
//            for (let i in this.hudGroup.children) {
//                let child = this.hudGroup.children[i];
//                child.x = (Math.cos(3) * r) + this.sprite.centerX;
//                child.y = (Math.sin(3) * r) + this.sprite.centerY;
//            }

//            let counter = 10;
//            let childIndex = 0;
//            for (let i = 0; i < 2 * 3.14; i += 0.01) {
//                counter++;
//                this.hudAngle += 0.2;
//
//                if (counter % 30 !== 0)
//                    continue;
//
//                var child = this.hudGroup.children[childIndex];
//                child.x = this.sprite.centerX + r * Math.cos(i + this.hudAngle);
//                child.y = this.sprite.centerY + r * Math.sin(i + this.hudAngle);
//
//                childIndex++;
//            }
        }
    }
}