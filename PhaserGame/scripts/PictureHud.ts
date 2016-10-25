class PictureHud implements IUpdatable {
    private picture: Picture;
    private objectFactory: Phaser.GameObjectFactory;
    private key: string;
    private group: Phaser.Group;

    constructor(picture: Picture, key : string, objectFactory : Phaser.GameObjectFactory) {
        this.objectFactory = objectFactory;
        this.key = key;
        this.picture = picture;
        
        this.picture.GetSprite().events.onDragStart.add(() => {
            this.OnPictureDragStart();
        });
        this.picture.GetSprite().events.onDragStop.add(() => {
            this.OnPictureDragStop();
        });
    }

    public OnPictureDragStart = () => {
        if (this.group != null)
            this.group.destroy(true);

        this.group = this.objectFactory.group();

        let pictureSprite = this.picture.GetSprite();

        let r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));

        let counter = 10;
        for (let i = 0; i < 2 * 3.14; i += 0.01) {
            counter++;

            if (counter % 30 !== 0)
                continue;

            let hudSprite = this.group.create(pictureSprite.x, pictureSprite.y, this.key);
            ScreenHelper.ScaleByScreenWidth(hudSprite, 0.01);
            hudSprite.centerX = pictureSprite.centerX + r * Math.cos(i);
            hudSprite.centerY = pictureSprite.centerY + r * Math.sin(i);
        }
    }

    public OnPictureDragStop = () => {
        this.group.destroy(true);
    }

    public Update = () =>
    {
        if (this.group != null) {
            let pictureSprite = this.picture.GetSprite();

            this.group.centerX = pictureSprite.centerX;
            this.group.centerY = pictureSprite.centerY;
        }
    }
}