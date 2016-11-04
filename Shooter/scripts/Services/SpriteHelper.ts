class SpriteHelper {
    static GetSpriteRectangle = (sprite : Phaser.Sprite): Phaser.Rectangle => {
        return new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
    }
}