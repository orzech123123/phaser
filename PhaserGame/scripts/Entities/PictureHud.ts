class PictureHud extends GroupEntity implements IUpdatable {
    private picture: Picture;
    private angle : number;

    constructor(picture: Picture, key: string, objectFactory: Phaser.GameObjectFactory) {
        super(key, objectFactory, true);
        
        this.picture = picture;
        this.angle = 0;
        
        this.picture.GetSprite().events.onDragStart.add(() => {
            this.onPictureDragStart();
        });
        this.picture.GetSprite().events.onDragStop.add(() => {
            this.onPictureDragStop();
        });
    }

    private onPictureDragStart = () => {
        this.DestroyGroup();

        this.Group = this.ObjectFactory.group();

        let pictureSprite = this.picture.GetSprite();

        let r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));

        let counter = 10;
        for (let angle = 0; angle < 2 * 3.14; angle += 0.01) {
            counter++;

            if (counter % 30 !== 0)
                continue;

            let hudSprite = this.Group.create(pictureSprite.x, pictureSprite.y, this.Key);
            ScreenHelper.ScaleByScreenWidth(hudSprite, 0.01);
            hudSprite.x = pictureSprite.centerX + r * Math.cos(angle);
            hudSprite.y = pictureSprite.centerY + r * Math.sin(angle);
        }
    }

    private onPictureDragStop = () => {
        this.angle = 0;
        this.DestroyGroup();
    }

    public Update = () =>
    {
        if (this.Group != null) {
            let pictureSprite = this.picture.GetSprite();

            this.Group.centerX = pictureSprite.centerX;
            this.Group.centerY = pictureSprite.centerY;

            let r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));

            let counter = 10;
            let spriteIndex = 0;

            for (let angle = 0; angle < 2 * 3.14; angle += 0.01) {
                counter++;

                if (counter % 30 !== 0)
                    continue;

                let child = this.Group.children[spriteIndex];
                child.x = pictureSprite.centerX + r * Math.cos(angle + this.angle);
                child.y = pictureSprite.centerY + r * Math.sin(angle + this.angle);

                spriteIndex++;
            }

            this.angle += 0.01;
        }
    }
}