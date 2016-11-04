var ExtraMedia = (function () {
    function ExtraMedia(src, successCallback, errorCallback, statusCallback, infiniteLoop) {
        var _this = this;
        this.tryInfiniteLoop = function () {
            if (_this.infiniteLoop && _this.status === Media.MEDIA_STOPPED)
                _this.Media.play();
        };
        this.changeStatus = function (status) {
            _this.status = status;
        };
        this.Replay = function () {
            if (_this.status === Media.MEDIA_STARTING ||
                _this.status === Media.MEDIA_RUNNING ||
                _this.status === Media.MEDIA_PAUSED)
                _this.Media.stop();
            _this.Media.play();
        };
        this.infiniteLoop = infiniteLoop;
        if (src.slice(0, "http".length) !== "http" && src.slice(0, "www".length) !== "www")
            src = (DeviceHelper.IsWindows() ? "ms-appx://io.cordova.myapp81c339/www/" : "file:///android_asset/www/") + src;
        this.Media = new Media(src, successCallback, errorCallback, function (status) {
            _this.changeStatus(status);
            _this.tryInfiniteLoop();
            if (!!statusCallback)
                statusCallback(status);
        });
    }
    ExtraMedia.prototype.Preload = function () {
        if (this.mediaLoaded)
            return;
        this.Media.setVolume(0.001);
        this.Media.play();
        this.Media.setVolume(1);
    };
    return ExtraMedia;
})();
var PhaserGame = (function () {
    function PhaserGame() {
        var _this = this;
        this.IsStarted = false;
        this.setOnPauseAndResume = function () {
            document.addEventListener("pause", function () {
                _this.backgroundBellsMusic.Media.pause();
            }, false);
            document.addEventListener("resume", function () {
                _this.backgroundBellsMusic.Media.play();
            }, false);
        };
    }
    PhaserGame.prototype.Init = function () {
        var _this = this;
        this.Phaser = new Phaser.Game(ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight(), Phaser.AUTO, "content", { preload: function () { _this.Preload(); }, create: function () { _this.Create(); }, update: function () { _this.Update(); }, render: function () { _this.Render(); } }, null, true, null);
    };
    PhaserGame.prototype.Start = function () {
        this.State.Generate(10);
        var boxSprite = this.BoxManager.GenerateBox();
        var hudRects = this.HudManager.GenerateHud();
        var excludeRects = Enumerable.From(hudRects).Union([SpriteHelper.GetSpriteRectangle(boxSprite)]).ToArray();
        this.PictureManager.GeneratePictures(this.State.Keys(), excludeRects);
        this.State.Start();
        this.IsStarted = true;
    };
    PhaserGame.prototype.Preload = function () {
        var _this = this;
        this.backgroundBellsMusic = new ExtraMedia("audio/christmasBell.mp3", null, null, null, true);
        this.backgroundBellsMusic.Media.setVolume(0.15);
        this.backgroundBellsMusic.Media.play();
        this.backgroundBellsMusic.Media.setVolume(0.15);
        this.TtsManager = new TtsManager(this);
        this.TtsManager.Preload();
        this.BoxManager = new BoxManager(this);
        this.BoxManager.Preload();
        this.HudManager = new HudManager(this);
        this.HudManager.Preload();
        this.menu = new Menu(this);
        this.PictureManager = new PictureManager(this);
        this.PictureManager.Preload();
        this.collidableManager = new CollidableManager();
        this.PreloadDynamicManager = new PreloadDynamicManager(this);
        this.State = new State(this);
        this.Phaser.load.image("gameBackground", "images/gameBackground.jpg");
        this.collidableManager.RegisterProvider(this.PictureManager);
        this.collidableManager.RegisterProvider(this.BoxManager);
        this.collidableManager.RegisterCollidableListener(this.State);
        this.PreloadDynamicManager.RegisterPreloadDynamic(this.PictureManager);
        this.State.RegisterOnValidAnswer(function (p) { _this.PictureManager.RemovePicture(p); });
        this.State.RegisterOnInvalidAnswer(function (p) { _this.PictureManager.MovePictureToLastPosition(p); });
        this.State.RegisterOnValidAnswer(function (p, s) { _this.HudManager.SetScore(s); });
        this.State.RegisterOnInvalidAnswer(function (p, s) { _this.HudManager.SetScore(s); });
        this.State.RegisterOnStart(function (key) { _this.TtsManager.PlayAudio(key); });
        this.State.RegisterOnMoveNext(function (key) { _this.TtsManager.PlayAudio(key); });
        this.State.RegisterOnStart(function (key) { _this.HudManager.SetPictureName(key); });
        this.State.RegisterOnMoveNext(function (key) { _this.HudManager.SetPictureName(key); });
        this.State.RegisterOnFinish(function (s) {
            var provider = new TtsProvider();
            var url = provider.GetAudioUrl("Gratulacje! Zdobyłeś " + String(s) + "punktów!");
            var media = new ExtraMedia(url, null, null, function (status) {
                if (status === Media.MEDIA_STOPPED) {
                    _this.IsStarted = false;
                    _this.menu.Show();
                }
            }, false);
            media.Replay();
        });
    };
    PhaserGame.prototype.Create = function () {
        this.Phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.createBackgroundImage();
        this.menu.Create();
        if (!DeviceHelper.IsWindows())
            this.setOnPauseAndResume();
        this.menu.Show();
    };
    PhaserGame.prototype.createBackgroundImage = function () {
        this.backgroundImage = this.Phaser.add.sprite(0, 0, "gameBackground");
        this.backgroundImage.inputEnabled = true;
        this.backgroundImage.scale.setTo(ScreenHelper.GetScreenWidth() / this.backgroundImage.width, ScreenHelper.GetScreenHeight() / this.backgroundImage.height);
    };
    PhaserGame.prototype.Render = function () {
    };
    PhaserGame.prototype.Update = function () {
        this.menu.Update();
        this.PictureManager.Update();
        this.collidableManager.Update();
    };
    return PhaserGame;
})();
//var musicFile = new Media("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%C5%BBryj%20o%C5%82%C3%B3w%20suko&tl=Pl-pl", null, null);
//var musicFile = new Media("ms-appdata:///www/audio/theme.mp3", null, null);
//    private emit(pointer : Phaser.Particles.Arcade.Emitter) {
//        //  Position the emitter where the mouse/touch event was
//        this.emitter.x = pointer.x;
//        this.emitter.y = pointer.y;
//        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
//        //  The second gives each particle a 2000ms lifespan
//        //  The third is ignored when using burst/explode mode
//        //  The final parameter (10) is how many particles will be emitted in this single burst
//        this.emitter.start(false, 2000, null, 10);
//    }
//        this.Phaser.physics.startSystem(Phaser.Physics.ARCADE);
//this.emitter = this.Phaser.add.emitter(0, 0, 100);
//this.emitter.makeParticles("jajo");
//this.emitter.gravity = 200;
//this.emitter.minParticleScale = 0.05;
//this.emitter.maxParticleScale = 0.1;
//this.Phaser.input.onDown.add((pointer) => { this.emit(pointer); }, this.Phaser); 
/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="./typings/jquery.d.ts" />
var Menu = (function () {
    function Menu(game) {
        var _this = this;
        this.Show = function () {
            _this.game.Phaser.paused = true;
            if (_this.game.IsStarted)
                _this.$resumeButton.show();
            else
                _this.$resumeButton.hide();
            _this.$menuScreen.show();
        };
        this.Hide = function () {
            _this.$menuScreen.hide();
            _this.game.Phaser.paused = false;
        };
        this.setBackButton = function () {
            if (DeviceHelper.IsWindows()) {
                _this.spaceKey = _this.game.Phaser.input.keyboard.addKey(Phaser.Keyboard.ESC);
            }
            else {
                document.addEventListener("backbutton", function () {
                    _this.onBackButton();
                }, false);
            }
        };
        this.onBackButton = function () {
            if (!_this.game.Phaser.paused) {
                _this.Show();
            }
            else {
            }
        };
        this.onStartButtonClick = function () {
            if (!_this.game.Phaser.paused)
                return;
            _this.game.PreloadDynamicManager.PreloadDynamicFor(function () {
                _this.game.Start();
                _this.Hide();
            });
        };
        this.onResumeButtonClick = function () {
            if (!_this.game.Phaser.paused)
                return;
            _this.Hide();
        };
        this.onQuitButtonClick = function () {
            window.close();
        };
        this.Update = function () {
            if (_this.spaceKey != null && _this.spaceKey.isDown)
                _this.onBackButton();
        };
        this.game = game;
        this.$menuScreen = $("#menuScreen");
        this.$startButton = $("#startButton");
        this.$startButton.on("click", function () { _this.onStartButtonClick(); });
        this.$quitButton = $("#quitButton");
        this.$quitButton.on("click", function () { _this.onQuitButtonClick(); });
        this.$resumeButton = $("#resumeButton");
        this.$resumeButton.on("click", function () { _this.onResumeButtonClick(); });
    }
    Menu.prototype.Create = function () {
        this.setBackButton();
    };
    return Menu;
})();
var RequestHelper = (function () {
    function RequestHelper() {
    }
    RequestHelper.Get = function (url) {
        var httpreq = new XMLHttpRequest();
        httpreq.open("GET", url, false);
        httpreq.send(null);
        return httpreq.responseText;
    };
    return RequestHelper;
})();
/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="./Services/RequestHelper.ts" />
var PictureKeys = (function () {
    function PictureKeys() {
        this.keys = JSON.parse(RequestHelper.Get("http://www.orzechservices.aspnet.pl/picturekey"));
    }
    Object.defineProperty(PictureKeys, "Instance", {
        get: function () {
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PictureKeys.prototype, "Keys", {
        get: function () {
            return this.keys;
        },
        enumerable: true,
        configurable: true
    });
    PictureKeys.instance = new PictureKeys();
    return PictureKeys;
})();
var State = (function () {
    function State(game) {
        var _this = this;
        this.isStarted = false;
        this.score = 0;
        this.Generate = function (count) {
            _this.isStarted = false;
            _this.keys = [];
            _this.score = 0;
            var keys = PictureKeys.Instance.Keys;
            var generatedKeys = [];
            while (generatedKeys.length < count) {
                var keysMinusGenerated = Enumerable.From(keys).Except(generatedKeys).ToArray();
                var tmpKeys = keysMinusGenerated.length > 0 ? keysMinusGenerated : keys;
                var tmpKey = tmpKeys[_this.game.Phaser.rnd.integerInRange(0, tmpKeys.length - 1)];
                if (generatedKeys.length > 1 && tmpKey === generatedKeys[generatedKeys.length - 1])
                    continue;
                generatedKeys.push(tmpKey);
            }
            _this.keys = generatedKeys;
        };
        this.moveNext = function () {
            if (_this.keys.length > 0)
                _this.keys.shift();
            if (_this.keys.length === 0) {
                for (var i in _this.onFinishActions)
                    _this.onFinishActions[i](_this.score);
                return;
            }
            for (var i in _this.onMoveNextActions)
                _this.onMoveNextActions[i](_this.CurrentKey());
        };
        this.game = game;
        this.keys = [];
        this.onMoveNextActions = [];
        this.onValidAnswerActions = [];
        this.onInvalidAnswerActions = [];
        this.onStartActions = [];
        this.onFinishActions = [];
    }
    State.prototype.Keys = function () {
        return this.keys;
    };
    State.prototype.CurrentKey = function () {
        if (this.keys.length === 0)
            return null;
        return this.keys[0];
    };
    State.prototype.RegisterOnMoveNext = function (action) {
        this.onMoveNextActions.push(action);
    };
    State.prototype.RegisterOnValidAnswer = function (action) {
        this.onValidAnswerActions.push(action);
    };
    State.prototype.RegisterOnInvalidAnswer = function (action) {
        this.onInvalidAnswerActions.push(action);
    };
    State.prototype.RegisterOnStart = function (action) {
        this.onStartActions.push(action);
    };
    State.prototype.RegisterOnFinish = function (action) {
        this.onFinishActions.push(action);
    };
    State.prototype.Update = function () { };
    State.prototype.CollidablesNotification = function (pairs) {
        var boxPictureCollides = Enumerable.From(pairs)
            .Where(function (p) {
            return (p.Collidable1 instanceof Box && p.Collidable2 instanceof Picture) ||
                (p.Collidable1 instanceof Picture && p.Collidable2 instanceof Box);
        })
            .Select(function (p) { return ({
            box: p.Collidable1 instanceof Box ? p.Collidable1 : p.Collidable2,
            picture: p.Collidable1 instanceof Picture ? p.Collidable1 : p.Collidable2
        }); })
            .ToArray();
        for (var i in boxPictureCollides) {
            var boxPicture = boxPictureCollides[i];
            var picture = boxPicture.picture;
            if (picture.Droped) {
                if (picture.Key === this.CurrentKey()) {
                    this.score++;
                    for (var j in this.onValidAnswerActions)
                        this.onValidAnswerActions[j](picture, this.score);
                    this.moveNext();
                }
                else {
                    this.score--;
                    for (var k in this.onInvalidAnswerActions)
                        this.onInvalidAnswerActions[k](picture, this.score);
                }
            }
        }
    };
    State.prototype.Start = function () {
        if (this.isStarted)
            return;
        for (var i in this.onStartActions)
            this.onStartActions[i](this.CurrentKey());
        this.isStarted = true;
    };
    return State;
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
            this.Init = function () {
                document.addEventListener("deviceready", _this.onDeviceReady, false);
            };
            this.onDeviceReady = function () {
                var game = new PhaserGame();
                game.Init();
            };
        }
        return Application;
    })();
    window.onload = function () {
        var app = new Application();
        app.Init();
    };
})(Application || (Application = {}));
var KeyEntity = (function () {
    function KeyEntity(key) {
        this.Key = key;
    }
    return KeyEntity;
})();
/// <reference path="KeyEntity.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpriteEntity = (function (_super) {
    __extends(SpriteEntity, _super);
    function SpriteEntity(group, x, y, key) {
        var _this = this;
        _super.call(this, key);
        this.Droped = true;
        this.GetSprite = function () {
            return _this.Sprite;
        };
        this.GetRect = function () {
            return SpriteHelper.GetSpriteRectangle(_this.Sprite);
        };
        this.DestroySprite = function () {
            if (_this.Sprite != null)
                _this.Sprite.destroy(true);
            _this.Sprite = null;
        };
        this.Sprite = group.create(x, y, key);
        this.LastDragPosition = new Phaser.Point(x, y);
        this.Sprite.events.onDragStart.add(function (sprite) {
            _this.LastDragPosition = new Phaser.Point(sprite.x, sprite.y);
            _this.Droped = false;
        });
        this.Sprite.events.onDragStop.add(function () {
            _this.Droped = true;
        });
    }
    SpriteEntity.prototype.Dispose = function () {
        if (this.Sprite != null)
            this.Sprite.destroy(true);
    };
    return SpriteEntity;
})(KeyEntity);
/// <reference path="SpriteEntity.ts" />
var Box = (function (_super) {
    __extends(Box, _super);
    function Box() {
        _super.apply(this, arguments);
    }
    Box.prototype.GetCollidableRect = function () { return this.GetRect(); };
    Box.prototype.Collide = function (otherCollidable) {
    };
    return Box;
})(SpriteEntity);
/// <reference path="KeyEntity.ts" />
var GroupEntity = (function (_super) {
    __extends(GroupEntity, _super);
    function GroupEntity(key, objectFactory, lazyGroupInit) {
        var _this = this;
        _super.call(this, key);
        this.DestroyGroup = function () {
            if (_this.Group != null)
                _this.Group.destroy(true);
            _this.Group = null;
        };
        this.CreateGroup = function () {
            if (_this.Group != null)
                return;
            _this.Group = _this.ObjectFactory.group();
        };
        this.RecreateGroup = function () {
            _this.DestroyGroup();
            _this.CreateGroup();
        };
        this.ObjectFactory = objectFactory;
        if (!lazyGroupInit)
            this.Group = objectFactory.group();
    }
    GroupEntity.prototype.Dispose = function () {
        if (this.Group != null)
            this.Group.destroy(true);
    };
    return GroupEntity;
})(KeyEntity);
var Picture = (function (_super) {
    __extends(Picture, _super);
    function Picture(group, x, y, key, dragAudio, dropAudio) {
        var _this = this;
        _super.call(this, group, x, y, key);
        this.EnableHud = function (key, factory) {
            if (_this.hud != null)
                return;
            _this.hud = new PictureHud(_this, key, factory);
        };
        this.Sprite.inputEnabled = true;
        this.Sprite.input.enableDrag();
        this.Sprite.input.boundsRect = ScreenHelper.GetScreenRectangle();
        ScreenHelper.ScaleByScreenWidth(this.Sprite, 0.1);
        if (dragAudio != null)
            this.Sprite.events.onDragStart.add(function () {
                dragAudio.Replay();
                ;
            });
        if (dropAudio != null)
            this.Sprite.events.onDragStop.add(function () {
                dropAudio.Replay();
            });
    }
    Picture.prototype.Update = function () {
        if (this.hud != null)
            this.hud.Update();
        this.Sprite.tint = 16777215;
    };
    Picture.prototype.GetCollidableRect = function () {
        return this.GetRect();
    };
    Picture.prototype.Collide = function (otherCollidable) {
        if (otherCollidable instanceof Box)
            this.Sprite.tint = Math.random() * 0xffffff;
    };
    Picture.prototype.Dispose = function () {
        if (this.hud != null)
            this.hud.Dispose();
        this.Droped = false;
        _super.prototype.Dispose.call(this);
    };
    return Picture;
})(SpriteEntity);
var PictureHud = (function (_super) {
    __extends(PictureHud, _super);
    function PictureHud(picture, key, objectFactory) {
        var _this = this;
        _super.call(this, key, objectFactory, true);
        this.onPictureDragStart = function () {
            _this.DestroyGroup();
            _this.Group = _this.ObjectFactory.group();
            var pictureSprite = _this.picture.GetSprite();
            var r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));
            var counter = 10;
            for (var angle = 0; angle < 2 * 3.14; angle += 0.01) {
                counter++;
                if (counter % 30 !== 0)
                    continue;
                var hudSprite = _this.Group.create(pictureSprite.x, pictureSprite.y, _this.Key);
                ScreenHelper.ScaleByScreenWidth(hudSprite, 0.01);
                hudSprite.x = pictureSprite.centerX + r * Math.cos(angle);
                hudSprite.y = pictureSprite.centerY + r * Math.sin(angle);
            }
        };
        this.onPictureDragStop = function () {
            _this.angle = 0;
            _this.DestroyGroup();
        };
        this.Update = function () {
            if (_this.Group != null) {
                var pictureSprite = _this.picture.GetSprite();
                _this.Group.centerX = pictureSprite.centerX;
                _this.Group.centerY = pictureSprite.centerY;
                var r = Math.sqrt(Math.pow(pictureSprite.width / 2, 2) + Math.pow(pictureSprite.height / 2, 2));
                var counter = 10;
                var spriteIndex = 0;
                for (var angle = 0; angle < 2 * 3.14; angle += 0.01) {
                    counter++;
                    if (counter % 30 !== 0)
                        continue;
                    var child = _this.Group.children[spriteIndex];
                    child.x = pictureSprite.centerX + r * Math.cos(angle + _this.angle);
                    child.y = pictureSprite.centerY + r * Math.sin(angle + _this.angle);
                    spriteIndex++;
                }
                _this.angle += 0.01;
            }
        };
        this.picture = picture;
        this.angle = 0;
        this.picture.GetSprite().events.onDragStart.add(function () {
            _this.onPictureDragStart();
        });
        this.picture.GetSprite().events.onDragStop.add(function () {
            _this.onPictureDragStop();
        });
    }
    return PictureHud;
})(GroupEntity);
/// <reference path="SpriteEntity.ts" />
var Star = (function (_super) {
    __extends(Star, _super);
    function Star() {
        _super.apply(this, arguments);
    }
    return Star;
})(SpriteEntity);
/// <reference path="../Entities/GroupEntity.ts" />
var BoxManager = (function (_super) {
    __extends(BoxManager, _super);
    function BoxManager(game) {
        var _this = this;
        _super.call(this, "boxbox", game.Phaser.add, false);
        this.GenerateBox = function () {
            _this.RecreateGroup();
            _this.box = new Box(_this.Group, 0, 0, _this.Key);
            _this.box.GetSprite().inputEnabled = true;
            ScreenHelper.ScaleByScreenWidth(_this.box.GetSprite(), 0.3);
            _this.box.GetSprite().centerX = ScreenHelper.GetScreenWidth() / 2;
            _this.box.GetSprite().centerY = ScreenHelper.GetScreenHeight() - _this.box.GetSprite().height / 2;
            return _this.box.GetSprite();
        };
        this.game = game;
    }
    BoxManager.prototype.Preload = function () {
        this.game.Phaser.load.image(this.Key, "images/box.png");
    };
    BoxManager.prototype.GetCollidables = function () {
        return [this.box];
    };
    return BoxManager;
})(GroupEntity);
var CollidableManager = (function () {
    function CollidableManager() {
        var _this = this;
        this.RegisterCollidableListener = function (listener) {
            _this.collidableListeners.push(listener);
        };
        this.providers = [];
        this.collidableListeners = [];
    }
    CollidableManager.prototype.Update = function () {
        var collidables = Enumerable.From(this.providers)
            .SelectMany(function (p) { return p.GetCollidables(); })
            .ToArray();
        var pairs = new Array();
        for (var i in collidables) {
            var collidable1 = collidables[i];
            for (var j in collidables) {
                if (i === j)
                    continue;
                var collidable2 = collidables[j];
                if (Phaser.Rectangle.intersects(collidable1.GetCollidableRect(), collidable2.GetCollidableRect())) {
                    collidable1.Collide(collidable2);
                    collidable2.Collide(collidable1);
                    pairs.push({ Collidable1: collidable1, Collidable2: collidable2 });
                }
            }
        }
        for (var i_1 in this.collidableListeners)
            this.collidableListeners[i_1].CollidablesNotification(pairs);
    };
    CollidableManager.prototype.RegisterProvider = function (provider) {
        this.providers.push(provider);
    };
    return CollidableManager;
})();
var DeviceHelper = (function () {
    function DeviceHelper() {
    }
    DeviceHelper.IsWindows = function () {
        return device.platform === "windows";
    };
    return DeviceHelper;
})();
var HudManager = (function (_super) {
    __extends(HudManager, _super);
    function HudManager(game) {
        _super.call(this, "", game.Phaser.add, true);
        this.fontSize = DeviceHelper.IsWindows() ? "32px" : "22px";
        this.game = game;
    }
    HudManager.prototype.Preload = function () {
        this.game.Phaser.load.image("starstar", "images/star.png");
    };
    HudManager.prototype.GenerateHud = function () {
        this.RecreateGroup();
        var font = "bold " + this.fontSize + " Arial";
        var margin = ScreenHelper.GetScreenHeight() / 20;
        this.star = new Star(this.Group, 0, 0, "starstar");
        ScreenHelper.ScaleByScreenHeight(this.star.GetSprite(), 0.125);
        this.star.GetSprite().centerX = (ScreenHelper.GetScreenWidth() - this.star.GetSprite().width / 2) - margin;
        this.star.GetSprite().centerY = (this.star.GetSprite().height / 2) + margin;
        this.scoreText = this.game.Phaser.add.text(this.star.GetSprite().centerX, this.star.GetSprite().centerY, "0", { font: font, fill: "white", align: "left" }, this.Group);
        this.scoreText.centerX = this.star.GetSprite().centerX;
        this.scoreText.centerY = this.star.GetSprite().centerY + this.star.GetSprite().height / 10;
        this.pictureNameText = this.game.Phaser.add.text(0 + margin, 0 + margin, "", { font: font, fill: "white", wordWrap: true, wordWrapWidth: ScreenHelper.GetScreenWidth() / 4, align: "center", backgroundColor: "#053272" }, this.Group);
        return [this.star.GetRect(), new Phaser.Rectangle(this.pictureNameText.x, this.pictureNameText.y, this.pictureNameText.width, this.pictureNameText.height)];
    };
    HudManager.prototype.SetScore = function (number) {
        this.scoreText.text = String(number);
    };
    HudManager.prototype.SetPictureName = function (name) {
        this.pictureNameText.text = name != null ? name.toUpperCase() : "";
    };
    return HudManager;
})(GroupEntity);
var ImageProvider = (function () {
    function ImageProvider() {
        var _this = this;
        this.GetImageUrl = function (q, style) {
            return _this.getFromIconFinder(q, style);
            //return this.getFromImageStock(q);
        };
        this.getFromIconFinder = function (q, style) {
            var url = "http://www.orzechservices.aspnet.pl/imageprovider/iconfinder?";
            //var url = "http://localhost:3654/imageprovider/iconfinder?";
            url = url + "q=" + q;
            if (!!style)
                url = url + "&style=" + style;
            url = url + "&stamp=" + Date.now();
            return url;
        };
        this.getFromImageStock = function (q) {
            var jsonObj = JSON.parse(RequestHelper.Get("http://testapi.bigstockphoto.com/2/883610/search/?q=" + q));
            var images = new Array();
            for (var i in jsonObj.data.images) {
                var image = jsonObj.data.images[i].small_thumb.url;
                images.push(image);
            }
            return images[0];
        };
    }
    return ImageProvider;
})();
var PictureManager = (function (_super) {
    __extends(PictureManager, _super);
    function PictureManager(game) {
        var _this = this;
        _super.call(this, "", game.Phaser.add, true);
        this.tryAddRect = function (rectangles, newRectangle) {
            var add = true;
            for (var i in rectangles) {
                var rectangle = rectangles[i];
                if (Phaser.Rectangle.intersects(rectangle, newRectangle)) {
                    add = false;
                    break;
                }
                if (!ScreenHelper.GetScreenRectangle().containsRect(newRectangle)) {
                    add = false;
                    break;
                }
            }
            return add;
        };
        this.Update = function () {
            if (_this.pictures != null) {
                for (var i in _this.pictures) {
                    _this.pictures[i].Update();
                }
            }
        };
        this.onTweenComplete = function (sprite) {
            var tween = Enumerable.From(_this.tweens)
                .Select(function (t, i) { return ({
                Match: t.Picture.GetSprite() === sprite,
                Picture: t.Picture,
                Index: i
            }); })
                .Where(function (t) { return t.Match; })
                .SingleOrDefault();
            if (tween == null)
                return;
            if (tween.Index >= 0) {
                tween.Picture.GetSprite().input.enabled = true;
                tween.Picture.Droped = false;
                _this.tweens.splice(tween.Index, 1);
            }
        };
        this.game = game;
        this.imageProvider = new ImageProvider();
        this.pictures = new Array();
        this.tweens = new Array();
    }
    PictureManager.prototype.GeneratePictures = function (keys, excludeRects) {
        this.RecreateGroup();
        this.Group.inputEnableChildren = true;
        var tempSprite = this.Group.create(0, 0, "test");
        ScreenHelper.ScaleByScreenWidth(tempSprite, 0.1);
        var rectangles = new Array();
        while (rectangles.length < keys.length) {
            var newRectangleX = this.game.Phaser.rnd.integerInRange(0, ScreenHelper.GetScreenWidth() - tempSprite.width);
            var newRectangleY = this.game.Phaser.rnd.integerInRange(0, ScreenHelper.GetScreenHeight() - tempSprite.height);
            var newRectangle = new Phaser.Rectangle(newRectangleX, newRectangleY, tempSprite.width, tempSprite.height);
            var add = true;
            add = this.tryAddRect(rectangles, newRectangle) &&
                (excludeRects == null || this.tryAddRect(excludeRects, newRectangle));
            if (add)
                rectangles.push(newRectangle);
        }
        this.Group.remove(tempSprite, true);
        this.pictures = [];
        for (var i in rectangles) {
            var key = keys[i];
            var rectangle = rectangles[i];
            var picture = new Picture(this.Group, rectangle.x, rectangle.y, key, this.dragAudio, this.dropAudio);
            this.pictures.push(picture);
            picture.EnableHud("pictureHud", this.game.Phaser.add);
        }
    };
    PictureManager.prototype.GetPreloadDynamicCount = function () {
        return PictureKeys.Instance.Keys.length + 2;
    };
    PictureManager.prototype.GetCollidables = function () {
        return this.pictures;
    };
    PictureManager.prototype.PreloadDynamic = function () {
        for (var index in PictureKeys.Instance.Keys) {
            var key = PictureKeys.Instance.Keys[index];
            this.game.Phaser.load.image(key, this.imageProvider.GetImageUrl(key, "3d"));
        }
        ;
        this.game.Phaser.load.image("test", "images/test.png");
        this.game.Phaser.load.image("pictureHud", "images/pictureHud.png");
    };
    PictureManager.prototype.RemovePicture = function (picture) {
        picture.Dispose();
        this.Group.remove(picture.GetSprite(), true);
        if (this.pictures.indexOf(picture) >= 0)
            this.pictures.splice(this.pictures.indexOf(picture), 1);
    };
    PictureManager.prototype.MovePictureToLastPosition = function (picture) {
        var _this = this;
        if (Enumerable.From(this.tweens).Any(function (t) { return t.Picture === picture; }))
            return;
        picture.GetSprite().input.enabled = false;
        picture.Droped = false;
        var tween = this.game.Phaser.add.tween(picture.GetSprite());
        tween.onComplete.add(function (sprite) { _this.onTweenComplete(sprite); });
        this.tweens.push({ Picture: picture, Tween: tween });
        tween.to({ x: picture.LastDragPosition.x, y: picture.LastDragPosition.y }, 1000);
        tween.start();
    };
    PictureManager.prototype.Preload = function () {
        this.dragAudio = new ExtraMedia("audio/drag.mp3", null, null, null);
        this.dropAudio = new ExtraMedia("audio/drop.mp3", null, null, null);
    };
    return PictureManager;
})(GroupEntity);
/// <reference path="../typings/jquery.d.ts" />
var PreloadDynamicManager = (function () {
    function PreloadDynamicManager(game) {
        var _this = this;
        this.onLoadComplete = function () {
            _this.game.Phaser.load.onFileComplete.removeAll();
            _this.game.Phaser.load.onLoadComplete.removeAll();
            if (_this.action != null) {
                _this.action();
                _this.action = null;
            }
            _this.$loadingScreen.hide();
        };
        this.onFileComplete = function () {
            _this.loaded++;
            var toLoad = Enumerable.From(_this.preloadDynamics).Select(function (d) { return d.GetPreloadDynamicCount(); }).Sum(function (c) { return c; });
            _this.$progressbar.progressbar({
                value: _this.loaded / toLoad * 100
            });
        };
        this.game = game;
        this.preloadDynamics = [];
        this.$loadingScreen = $("#loadingScreen");
        this.$progressbar = $("#progressbar");
        this.$progressbar.progressbar({
            value: 0
        });
    }
    PreloadDynamicManager.prototype.PreloadDynamicFor = function (action) {
        var _this = this;
        this.action = action;
        this.loaded = 0;
        this.$progressbar.progressbar({
            value: 0
        });
        this.$loadingScreen.css("display", "table-cell");
        this.game.Phaser.load.onFileComplete.add(function () { _this.onFileComplete(); });
        this.game.Phaser.load.onLoadComplete.add(function () { _this.onLoadComplete(); });
        for (var i in this.preloadDynamics)
            this.preloadDynamics[i].PreloadDynamic();
        this.game.Phaser.load.start();
    };
    PreloadDynamicManager.prototype.RegisterPreloadDynamic = function (preloadDynamic) {
        this.preloadDynamics.push(preloadDynamic);
    };
    return PreloadDynamicManager;
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
    ScreenHelper.GetScreenRectangle = function () {
        return new Phaser.Rectangle(0, 0, ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight());
    };
    return ScreenHelper;
})();
var SpriteHelper = (function () {
    function SpriteHelper() {
    }
    SpriteHelper.GetSpriteRectangle = function (sprite) {
        return new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
    };
    return SpriteHelper;
})();
var TtsManager = (function () {
    function TtsManager(game) {
        this.game = game;
        this.ttsProvider = new TtsProvider();
        this.mediaMap = {};
    }
    TtsManager.prototype.Preload = function () {
        for (var index in PictureKeys.Instance.Keys) {
            var key = PictureKeys.Instance.Keys[index];
            this.mediaMap[key] = new ExtraMedia(this.ttsProvider.GetAudioUrl(key), null, null, null);
            this.mediaMap[key].Preload();
        }
        ;
    };
    TtsManager.prototype.PlayAudio = function (sentence) {
        if (sentence == null)
            return;
        var audio = this.mediaMap[sentence];
        if (!audio)
            return;
        audio.Replay();
    };
    return TtsManager;
})();
var TtsProvider = (function () {
    function TtsProvider() {
    }
    TtsProvider.prototype.GetAudioUrl = function (sentence) {
        return "http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=" + sentence + "&tl=Pl-pl";
    };
    return TtsProvider;
})();
//# sourceMappingURL=appBundle.js.map