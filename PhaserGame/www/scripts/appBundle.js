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
            _this.background.object.scale.setTo(window.screen.width / _this.background.object.width, window.screen.height / _this.background.object.height);
            var group = _this.game.add.group();
            group.inputEnableChildren = true;
            var screenRectangle = new Phaser.Rectangle(0, 0, window.screen.width, window.screen.height);
            for (var i = 0; i < 3; i++) {
                var added = false;
                while (!added) {
                    var addFailed = false;
                    var sprite = group.create(_this.game.rnd.integerInRange(0, window.screen.width), _this.game.rnd.integerInRange(0, window.screen.height), "box");
                    sprite.inputEnabled = true;
                    sprite.input.enableDrag();
                    sprite.input.boundsRect = screenRectangle;
                    var children = group.children;
                    for (var j in children) {
                        var child = children[j];
                        if (child === sprite)
                            continue;
                        var childRectangle = new Phaser.Rectangle(child.x, child.y, child.width, child.height);
                        var spriteRectangle = new Phaser.Rectangle(sprite.x, sprite.y, child.width, child.height);
                        if (Phaser.Rectangle.intersects(childRectangle, spriteRectangle)) {
                            console.log("AddFail: intersects");
                            group.remove(sprite, true);
                            addFailed = true;
                            break;
                        }
                        if (!screenRectangle.containsRect(spriteRectangle)) {
                            console.log("AddFail: !containsRect");
                            group.remove(sprite, true);
                            addFailed = true;
                            break;
                        }
                    }
                    if (!addFailed)
                        added = true;
                }
            }
            //        sonic.events.onDragStart.add(() => { this.onDragStart(); }, this);
            //        sonic.events.onDragStop.add(() => { this.onDragStop(); }, this);
            //
            //        group.onChildInputDown.add(() => { this.onDown(); }, this);
            //var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
            var musicFile = new Media("file:///android_asset/www/audio/theme.mp3", null, null);
            //var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
            musicFile.play();
        };
        this.Get = function (yourUrl) {
            var Httpreq = new XMLHttpRequest(); // a new request
            Httpreq.open("GET", yourUrl, false);
            Httpreq.send(null);
            return Httpreq.responseText;
        };
        this.render = function () {
        };
        this.update = function () {
        };
        this.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO, "content", { preload: function () { _this.preload(); }, create: function () { _this.create(); }, update: function () { _this.update(); }, render: function () { _this.render(); } });
    }
    PhaserGame.prototype.preload = function () {
        var json_obj = JSON.parse(this.Get("http://testapi.bigstockphoto.com/2/883610/search/?q=dog"));
        var images = new Array();
        for (var i in json_obj.data.images) {
            var image = json_obj.data.images[i].small_thumb.url;
            images.push(image);
        }
        this.game.load.image("background", "images/background.jpg");
        //this.game.load.image("box", "images/box.jpg");
        this.game.load.image("box", images[0]);
    };
    return PhaserGame;
})();
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
/// <reference path="Game.ts" />
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