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
            //        var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
            //        var musicFile = new Media("file:///android_asset/www/audio/theme.mp3", null, null);
            var musicFile = new Media("/www/audio/theme.mp3", null, null);
            musicFile.play();
            _this.getPhoneGapPath();
        };
        this.getPhoneGapPath = function () {
            var path = window.location.pathname;
            //path = path.substr(path, path.length - 10);
            return path;
        };
        this.update = function () {
            console.log(window.screen.width);
            console.log(window.screen.height);
        };
        this.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO, "content", { preload: function () { _this.preload(); }, create: function () { _this.create(); }, update: function () { _this.update(); } });
    }
    PhaserGame.prototype.preload = function () {
        this.game.load.image("background", "images/background.jpg");
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