/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="./Services/RequestHelper.ts" />

class PictureKeys {
    private static instance = new PictureKeys();

    private keys: Array<string>;

    constructor() {
        this.keys = JSON.parse(RequestHelper.Get("http://www.orzechservices.aspnet.pl/picturekey"));
    }

    static get Instance(): PictureKeys {
        return this.instance;
    }

    get Keys(): string[] {
        return this.keys;
    }
}