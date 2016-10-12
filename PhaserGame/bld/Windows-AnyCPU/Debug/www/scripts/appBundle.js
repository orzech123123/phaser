var ImageProvider = (function () {
    function ImageProvider() {
        this.GetImageUrl = function (q, style) {
            var url = "http://localhost:3654/home/index?";
            url = url + "q=" + q;
            if (!!style)
                url = url + "&style=" + style;
            return url;
        };
    }
    return ImageProvider;
})();
/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="ImageProvider.ts" />
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
            var test = group.create(0, 0, "box");
            var testTargetWidth = window.screen.width / 10;
            var scale = testTargetWidth / test.width;
            test.scale.setTo(scale, scale);
            var rectangles = new Array();
            while (rectangles.length < 10) {
                var newRectangle = new Phaser.Rectangle(_this.game.rnd.integerInRange(0, window.screen.width), _this.game.rnd.integerInRange(0, window.screen.height), test.width, test.height);
                var add = true;
                for (var i in rectangles) {
                    var rectangle = rectangles[i];
                    if (Phaser.Rectangle.intersects(rectangle, newRectangle)) {
                        add = false;
                        break;
                    }
                    if (!screenRectangle.containsRect(newRectangle)) {
                        add = false;
                        break;
                    }
                }
                if (add)
                    rectangles.push(newRectangle);
            }
            group.remove(test, true);
            for (var i in rectangles) {
                var rectangle = rectangles[i];
                var sprite = group.create(rectangle.x, rectangle.y, "box");
                sprite.inputEnabled = true;
                sprite.input.enableDrag();
                sprite.input.boundsRect = screenRectangle;
                sprite.scale.setTo(scale, scale);
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
        var url = new ImageProvider().GetImageUrl("car");
        this.game.load.image("background", "images/background.jpg");
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