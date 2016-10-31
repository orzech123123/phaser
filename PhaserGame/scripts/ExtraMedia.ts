class ExtraMedia implements IPreload {
    private infiniteLoop: boolean;
    private status : number;
    public Media : Media;
    private mediaLoaded : boolean;

    constructor(src: string, successCallback: () => void, errorCallback?: () => void, statusCallback?: () => void, infiniteLoop?: boolean) {
        this.infiniteLoop = infiniteLoop;

        if (src.slice(0, "http".length) !== "http" && src.slice(0, "www".length) !== "www")
            src = (DeviceHelper.IsWindows() ? "ms-appx://io.cordova.myapp81c339/www/" : "file:///android_asset/www/") + src;

        this.Media = new Media(src, successCallback, errorCallback, (status: number) => {
            this.changeStatus(status);

            this.tryInfiniteLoop();

            if(!!statusCallback)
                statusCallback();
        });
    }

    private tryInfiniteLoop = () => {
        if (this.infiniteLoop && this.status === Media.MEDIA_STOPPED)
            this.Media.play();
    }

    private changeStatus = (status: number) => {
        this.status = status;
    }

    public Replay = () : void => {
        if (this.status === Media.MEDIA_STARTING ||
            this.status === Media.MEDIA_RUNNING ||
            this.status === Media.MEDIA_PAUSED)
            this.Media.stop();

        this.Media.play();
    }

    Preload(): void {
        if (this.mediaLoaded)
            return;

        this.Media.setVolume(0.001);
        this.Media.play();
        this.Media.setVolume(1);
    }
}