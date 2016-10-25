/// <reference path="SpriteEntity.ts" />

class Box extends SpriteEntity implements ICollidable {
    GetCollidableRect(): Phaser.Rectangle { return this.GetRect(); }

    Collide(otherCollidable: ICollidable) {
        console.log(otherCollidable instanceof Picture);
    }
}