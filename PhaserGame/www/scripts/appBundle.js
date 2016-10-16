var ImageProvider = (function () {
    function ImageProvider() {
        var _this = this;
        this.GetImageUrl = function (q, style) {
            //return this.getFromIconFinder(q, style);
            return _this.getFromImageStock(q);
        };
        this.getFromIconFinder = function (q, style) {
            var url = "http://localhost:3654/imageprovider/iconfinder?";
            url = url + "q=" + q;
            if (!!style)
                url = url + "&style=" + style;
            return url;
        };
        this.getFromImageStock = function (q) {
            var jsonObj = JSON.parse(_this.get("http://testapi.bigstockphoto.com/2/883610/search/?q=" + q));
            var images = new Array();
            for (var i in jsonObj.data.images) {
                var image = jsonObj.data.images[i].small_thumb.url;
                images.push(image);
            }
            return images[0];
        };
        this.get = function (yourUrl) {
            var httpreq = new XMLHttpRequest();
            httpreq.open("GET", yourUrl, false);
            httpreq.send(null);
            return httpreq.responseText;
        };
    }
    return ImageProvider;
})();
/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="ImageProvider.ts" />
var PhaserGame = (function () {
    function PhaserGame() {
        var _this = this;
        this.preload = function () {
            _this.phaser.load.image("background", "images/background.jpg");
            _this.phaser.load.image("sprite", _this.imageProvider.GetImageUrl("dog"));
            _this.phaser.load.image("jajo", "images/jajo.png");
            _this.menu.Preload();
        };
        this.create = function () {
            _this.phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            _this.background = _this.phaser.add.sprite(0, 0, "background");
            _this.background.inputEnabled = true;
            _this.background.scale.setTo(ScreenHelper.GetScreenWidth() / _this.background.width, ScreenHelper.GetScreenHeight() / _this.background.height);
            _this.phaser.physics.startSystem(Phaser.Physics.ARCADE);
            _this.emitter = _this.phaser.add.emitter(0, 0, 100);
            _this.emitter.makeParticles("jajo");
            _this.emitter.gravity = 200;
            _this.emitter.minParticleScale = 0.05;
            _this.emitter.maxParticleScale = 0.1;
            _this.phaser.input.onDown.add(function (pointer) { _this.emit(pointer); }, _this.phaser);
            _this.menu.Create();
            //var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
            var musicFile = new Media("file:///android_asset/www/audio/agibagi.mp3", null, null);
            //var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
            musicFile.play();
            _this.menu.Show();
        };
        this.emit = function (pointer) {
            //  Position the emitter where the mouse/touch event was
            _this.emitter.x = pointer.x;
            _this.emitter.y = pointer.y;
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst
            _this.emitter.start(false, 2000, null, 10);
        };
        this.render = function () {
        };
        this.update = function () {
        };
        this.imageProvider = new ImageProvider();
        this.menu = new Menu(this);
        this.phaser = new Phaser.Game(ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight(), Phaser.AUTO, "content", { preload: function () { _this.preload(); }, create: function () { _this.create(); }, update: function () { _this.update(); }, render: function () { _this.render(); } }, null, true, null);
    }
    PhaserGame.prototype.Start = function () {
        if (this.group != null)
            this.group.removeAll(true);
        this.group = this.phaser.add.group();
        this.group.inputEnableChildren = true;
        var screenRectangle = new Phaser.Rectangle(0, 0, ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight());
        var test = this.group.create(0, 0, "sprite");
        ScreenHelper.ScaleByScreenWidth(test, 0.1);
        var rectangles = new Array();
        while (rectangles.length < 10) {
            var newRectangle = new Phaser.Rectangle(this.phaser.rnd.integerInRange(0, ScreenHelper.GetScreenWidth()), this.phaser.rnd.integerInRange(0, ScreenHelper.GetScreenHeight()), test.width, test.height);
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
        this.group.remove(test, true);
        for (var i in rectangles) {
            var rectangle = rectangles[i];
            var sprite = this.group.create(rectangle.x, rectangle.y, "sprite");
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.input.boundsRect = screenRectangle;
            ScreenHelper.ScaleByScreenWidth(sprite, 0.1);
        }
    };
    return PhaserGame;
})();
/// <reference path="../www/scripts/typings/phaser.d.ts" />
var Menu = (function () {
    function Menu(game) {
        var _this = this;
        this.Show = function () {
            _this.game.phaser.paused = true;
            _this.startButton.visible = true;
            _this.background.visible = true;
            _this.pauseText.visible = false;
        };
        this.Hide = function () {
            _this.pauseText.visible = true;
            _this.startButton.visible = false;
            _this.background.visible = false;
            _this.game.phaser.paused = false;
        };
        this.onScreenClick = function () {
            if (!_this.game.phaser.paused)
                return;
            var startButtonRect = new Phaser.Rectangle(_this.startButton.x, _this.startButton.y, _this.startButton.width, _this.startButton.height);
            if (!startButtonRect.contains(_this.game.phaser.input.x, _this.game.phaser.input.y) && _this.game.phaser.input.x > 0 && _this.game.phaser.input.y > 0)
                return;
            _this.Hide();
            _this.game.Start();
        };
        this.game = game;
    }
    Menu.prototype.Preload = function () {
        this.game.phaser.load.spritesheet("button", "images/start.png", 0, 0);
        this.game.phaser.load.image("menu_background", "images/agibagi.jpg");
    };
    Menu.prototype.Create = function () {
        var _this = this;
        if (this.group != null)
            this.group.removeAll(true);
        this.group = this.game.phaser.add.group();
        this.background = this.game.phaser.add.sprite(0, 0, "menu_background");
        this.background.scale.setTo(ScreenHelper.GetScreenWidth() / this.background.width, ScreenHelper.GetScreenHeight() / this.background.height);
        this.group.add(this.background);
        this.startButton = this.game.phaser.add.button(0, 0, "button", function () { }, this.game.phaser);
        this.startButton.visible = false;
        ScreenHelper.ScaleByScreenHeight(this.startButton, 0.3);
        this.startButton.centerX = ScreenHelper.GetScreenWidth() / 2 + (ScreenHelper.GetScreenWidth() / 4);
        this.startButton.centerY = ScreenHelper.GetScreenHeight() / 4;
        this.group.add(this.startButton);
        this.pauseText = this.game.phaser.add.text(0, 0, "Pause", { font: "24px Arial", fill: "#fff" });
        this.pauseText.inputEnabled = true;
        ScreenHelper.ScaleByScreenWidth(this.pauseText, 0.05);
        this.pauseText.x = ScreenHelper.GetScreenWidth() - this.pauseText.width - 10;
        this.pauseText.y += 10;
        this.group.add(this.pauseText);
        this.pauseText.events.onInputUp.add(function () {
            _this.Create();
            _this.Show();
        });
        this.game.phaser.input.onDown.add(function () { _this.onScreenClick(); }, this.game.phaser);
    };
    return Menu;
})();
var ScreenHelper = (function () {
    function ScreenHelper() {
    }
    ScreenHelper.GetScreenWidth = function () {
        return window.screen.width;
    };
    ScreenHelper.GetScreenHeight = function () {
        return window.screen.height;
    };
    ScreenHelper.ScaleByScreenWidth = function (sprite, scale) {
        if (scale < 0 || scale > 1)
            throw "ScaleByScreenWidth: ArgumentException";
        var targetWidth = ScreenHelper.GetScreenWidth() * scale;
        var targetScale = targetWidth / sprite.width;
        sprite.scale.x = targetScale;
        sprite.scale.y = targetScale;
    };
    ScreenHelper.ScaleByScreenHeight = function (sprite, scale) {
        if (scale < 0 || scale > 1)
            throw "ScaleByScreenWidth: ArgumentException";
        var targetHeight = ScreenHelper.GetScreenHeight() * scale;
        var targetScale = targetHeight / sprite.height;
        sprite.scale.x = targetScale;
        sprite.scale.y = targetScale;
    };
    return ScreenHelper;
})();
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
/// <reference path="Game.ts" />
var Application;
(function (Application_1) {
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
})(Application || (Application = {}));
//# sourceMappingURL=appBundle.js.map