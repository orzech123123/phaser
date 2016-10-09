/// <reference path="../www/scripts/typings/phaser.d.ts" />
var MySprite = (function () {
    function MySprite(object) {
        this.object = object;
    }
    return MySprite;
})();
var PhaserGame = (function () {
    function PhaserGame() {
        var _this = this;
        this.create = function () {
            _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            _this.background = new MySprite(_this.game.add.sprite(0, 0, "background"));
            _this.background.object.inputEnabled = true;
            //this.background.object.events.onInputDown.add((sprite, event) => { this.placeItem(sprite, event); }, this);
            _this.background.object.scale.setTo(window.screen.width / _this.background.object.width, window.screen.height / _this.background.object.height);
            _this.game.physics.startSystem(Phaser.Physics.ARCADE);
            _this.game.stage.backgroundColor = "#0072bc";
            _this.boxSprite = _this.game.add.sprite(200, 200, "box");
            _this.boxSprite.anchor.setTo(0.5, 0.5);
            _this.boxSprite.scale.set(0.5, 0.5);
            //  Enable Arcade Physics for the sprite
            _this.game.physics.enable(_this.boxSprite, Phaser.Physics.ARCADE);
            //  Tell it we don't want physics to manage the rotation
            _this.boxSprite.body.allowRotation = false;
            //var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
            //var musicFile = new Media("file:///android_asset/www/audio/theme.mp3", null, null);
            var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
            musicFile.play();
        };
        this.render = function () {
            //this.game.debug.spriteInfo(this.boxSprite, 32, 32);
        };
        this.update = function () {
            _this.boxSprite.rotation = _this.game.physics.arcade.moveToPointer(_this.boxSprite, 60, _this.game.input.activePointer, 500);
        };
        this.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO, "content", { preload: function () { _this.preload(); }, create: function () { _this.create(); }, update: function () { _this.update(); }, render: function () { _this.render(); } });
    }
    PhaserGame.prototype.preload = function () {
        this.game.load.image("background", "images/background.jpg");
        this.game.load.image("box", "images/box.jpg");
    };
    return PhaserGame;
})();
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
/// <reference path="Game2.ts" />
var PhaserGame33;
(function (PhaserGame33) {
    "use strict";
    var Application = (function () {
        function Application() {
            var _this = this;
            this.initialize = function () {
                document.addEventListener('deviceready', _this.onDeviceReady, false);
            };
            this.onDeviceReady = function () {
            };
        }
        return Application;
    })();
    window.onload = function () {
        var game = new PhaserGame();
    };
})(PhaserGame33 || (PhaserGame33 = {}));
//# sourceMappingURL=appBundle.js.map