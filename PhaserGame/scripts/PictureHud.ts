class PictureHud implements IUpdatable {
    private picture: Picture;
    private objectFactory: Phaser.GameObjectFactory;
    private key: string;
    private group: Phaser.Group;
    private angle : number;

    constructor(picture: Picture, key : string, objectFactory : Phaser.GameObjectFactory) {
        this.objectFactory = objectFactory;
        this.key = key;
        this.picture = picture;
        this.angle = 0;
        
        this.picture.GetSprite().events.onDragStart.add(() => {
            this.OnPictureDragStart();
        });
        this.picture.GetSprite().events.onDragStop.add(() => {
            this.OnPictureDragStop();
        });
    }

    public OnPictureDragStart = () => {
        this.destroyGroup();

        this.group = this.objectFactory.group();

        let pictureSprite = this.picture.GetSprite();

        let r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));

        let counter = 10;
        for (let angle = 0; angle < 2 * 3.14; angle += 0.01) {
            counter++;

            if (counter % 30 !== 0)
                continue;

            let hudSprite = this.group.create(pictureSprite.x, pictureSprite.y, this.key);
            ScreenHelper.ScaleByScreenWidth(hudSprite, 0.01);
            hudSprite.x = pictureSprite.centerX + r * Math.cos(angle);
            hudSprite.y = pictureSprite.centerY + r * Math.sin(angle);
        }
    }

    public OnPictureDragStop = () => {
        this.angle = 0;
        this.destroyGroup();
    }

    private destroyGroup = () => {
        if (this.group != null) {
            this.group.destroy(true);
            this.group = null;
        }
    }

    public Update = () =>
    {
        if (this.group != null) {
            let pictureSprite = this.picture.GetSprite();

            this.group.centerX = pictureSprite.centerX;
            this.group.centerY = pictureSprite.centerY;

            let r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));

            let counter = 10;
            let spriteIndex = 0;

            for (let angle = 0; angle < 2 * 3.14; angle += 0.01) {
                counter++;

                if (counter % 30 !== 0)
                    continue;

                let child = this.group.children[spriteIndex];
                child.x = pictureSprite.centerX + r * Math.cos(angle + this.angle);
                child.y = pictureSprite.centerY + r * Math.sin(angle + this.angle);

                spriteIndex++;
            }

            this.angle += 0.01;
        }
    }
}