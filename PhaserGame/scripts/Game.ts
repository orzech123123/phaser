class PhaserGame {
    public Phaser: Phaser.Game;
    public PictureManager: IPictureManager;
    public TtsManager: ITtsManager;
    public BoxManager: IBoxManager;
    public PreloadDynamicManager: IPreloadDynamicManager;
    public HudManager: IHudManager;
    public State: IState;

    private menu: Menu;
    private backgroundBellsMusic: ExtraMedia;
    private backgroundImage: Phaser.Sprite;
    private collidableManager: IColidableManager;

    public Init(): void {
        this.Phaser = new Phaser.Game(ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight(), Phaser.AUTO, "content", { preload: () => { this.Preload(); }, create: () => { this.Create(); }, update: () => { this.Update(); }, render: () => { this.Render(); } }, null, true, null);
    }

    public Start(): void {
        this.State.Generate(10);

        var boxSprite = this.BoxManager.GenerateBox();
        var hudRects = this.HudManager.GenerateHud();
        let excludeRects = Enumerable.From(hudRects).Union([SpriteHelper.GetSpriteRectangle(boxSprite)]).ToArray();
        this.PictureManager.GeneratePictures(this.State.Keys(), excludeRects);

        this.State.Start();
    }

    public Preload(): void {
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
        this.State.RegisterOnValidAnswer((p) => { this.PictureManager.RemovePicture(p); });
        this.State.RegisterOnInvalidAnswer((p) => { this.PictureManager.MovePictureToLastPosition(p); });
        this.State.RegisterOnValidAnswer(() => { this.HudManager.ScorePlus(1); });
        this.State.RegisterOnInvalidAnswer(() => { this.HudManager.ScoreMinus(1); });
        this.State.RegisterOnStart((key) => { this.TtsManager.PlayAudio(key); });
        this.State.RegisterOnMoveNext((key) => { this.TtsManager.PlayAudio(key); });
        this.State.RegisterOnStart((key) => { this.HudManager.SetPictureName(key); });
        this.State.RegisterOnMoveNext((key) => { this.HudManager.SetPictureName(key); });
    }

    public Create(): void {
        this.Phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.createBackgroundImage();
        this.menu.Create();

        if (!DeviceHelper.IsWindows())
            this.setOnPauseAndResume();

        this.menu.Show();
    }

    private setOnPauseAndResume = () => {
        document.addEventListener("pause", () => {
            this.backgroundBellsMusic.Media.pause();
        }, false);
        document.addEventListener("resume", () => {
            this.backgroundBellsMusic.Media.play();
        }, false);
    }

    private createBackgroundImage(): void {
        this.backgroundImage = this.Phaser.add.sprite(0, 0, "gameBackground");
        this.backgroundImage.inputEnabled = true;
        this.backgroundImage.scale.setTo(ScreenHelper.GetScreenWidth() / this.backgroundImage.width, ScreenHelper.GetScreenHeight() / this.backgroundImage.height);
    }

    public Render() {
    }

    public Update() {
        this.menu.Update();
        this.PictureManager.Update();
        this.collidableManager.Update();
    }
}


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