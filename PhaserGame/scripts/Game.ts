/// <reference path="../www/scripts/typings/phaser.d.ts" />
/// <reference path="ImageProvider.ts" />

class PhaserGame {
    public Phaser: Phaser.Game;
    public PictureManager: IPictureManager;
    public TtsManager: ITtsManager;
    
    private menu: Menu;
    private backgroundMusic : ExtraMedia;
    private backgroundImage: Phaser.Sprite;

    constructor() {
        this.menu = new Menu(this);
        this.PictureManager = new PictureManager(this);
        this.TtsManager = new TtsManager(this);
    }
    
    public Init() : void {
        this.Phaser = new Phaser.Game(ScreenHelper.GetScreenWidth(), ScreenHelper.GetScreenHeight(), Phaser.AUTO, "content", { preload: () => { this.Preload(); }, create: () => { this.Create(); }, update: () => { this.Update(); }, render: () => { this.Render(); } }, null, true, null);
    }

    public Start() : void {
        this.PictureManager.GeneratePictures(10);
    }
    
    public Preload() : void {
        this.Phaser.load.image("backgroundImage", "images/background.jpg");
        this.backgroundMusic = new ExtraMedia("file:///android_asset/www/audio/agibagi.mp3", null, null, null, true);
        this.PictureManager.Preload();
        this.TtsManager.Preload();
        this.menu.Preload();
    }

    public Create(): void {
        this.Phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.createBackgroundImage();
        this.menu.Create();
        
        this.backgroundMusic.SetVolume(0.3);        
        this.backgroundMusic.Play();
        this.backgroundMusic.SetVolume(0.3);

        this.menu.Show();
    }

    private createBackgroundImage(): void {
        this.backgroundImage = this.Phaser.add.sprite(0, 0, "backgroundImage");
        this.backgroundImage.inputEnabled = true;
        this.backgroundImage.scale.setTo(ScreenHelper.GetScreenWidth() / this.backgroundImage.width, ScreenHelper.GetScreenHeight() / this.backgroundImage.height);
    }
    
    public Render() {
    }
    
    public Update() {
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
}
