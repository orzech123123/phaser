class PhaserGame {
    public Phaser: Phaser.Game;
    public PictureManager: IPictureManager;
    public TtsManager: ITtsManager;
    public BoxManager: IBoxManager;
    public PreloadDynamicManager: IPreloadDynamicManager;
    
    private menu: Menu;
    private backgroundMusic : ExtraMedia;
    private backgroundBellsMusic : ExtraMedia;
    private backgroundImage: Phaser.Sprite;
    private isStarted: boolean;
    private collidableManager : IColidableManager;

    constructor() {
        this.isStarted = false;
    }
    
    public Init() : void {
        this.Phaser = new Phaser.Game(ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight(), Phaser.AUTO, "content", { preload: () => { this.Preload(); }, create: () => { this.Create(); }, update: () => { this.Update(); }, render: () => { this.Render(); } }, null, true, null);
    }

    public Start(): void {
//        if (this.isStarted)
//            return;
        var boxSprite = this.BoxManager.GenerateBox();
        this.PictureManager.GeneratePictures(10, [SpriteHelper.GetSpriteRectangle(boxSprite)]);

        this.isStarted = true;
    }
    
    public Preload(): void {
        this.menu = new Menu(this);
        this.PictureManager = new PictureManager(this);
        this.TtsManager = new TtsManager(this);
        this.BoxManager = new BoxManager(this);
        this.collidableManager = new CollidableManager();
        this.PreloadDynamicManager = new PreloadDynamicManager(this);


        this.Phaser.load.image("gameBackground", "images/gameBackground.jpg");

        this.backgroundMusic = new ExtraMedia("file:///android_asset/www/audio/agibagi.mp3", null, null, null, true);
        this.backgroundBellsMusic = new ExtraMedia("file:///android_asset/www/audio/christmasBell.mp3", null, null, null, true);

        this.TtsManager.Preload();
        this.BoxManager.Preload();
        this.menu.Preload();

        this.collidableManager.RegisterProvider(this.PictureManager);
        this.collidableManager.RegisterProvider(this.BoxManager);
        this.PreloadDynamicManager.RegisterPreloadDynamic(this.PictureManager);
    }

    public Create(): void {
        this.Phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.createBackgroundImage();
        this.menu.Create();
        
        this.backgroundMusic.Media.setVolume(0.3);        
        this.backgroundMusic.Media.play();
        this.backgroundMusic.Media.setVolume(0.3);
        this.backgroundBellsMusic.Media.setVolume(0.15);
        this.backgroundBellsMusic.Media.play();
        this.backgroundBellsMusic.Media.setVolume(0.15);
        this.trySetOnPauseAndResume();

        this.menu.Show();
    }

    private trySetOnPauseAndResume = () => {
        if (!device || !device.platform || device.platform === "windows")
            return;
             
        document.addEventListener("pause", () => {
            this.backgroundMusic.Media.pause();
            this.backgroundBellsMusic.Media.pause();
        }, false);
        document.addEventListener("resume", () => {
            this.backgroundMusic.Media.play();
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