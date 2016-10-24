class ExtraMedia implements IPreload {
    private infiniteLoop: boolean;
    private status : number;
    private media: Media;
    private mediaLoaded : boolean;

    constructor(src: string, successCallback: () => void, errorCallback?: () => void, statusCallback?: () => void, infiniteLoop?: boolean) {
        this.infiniteLoop = infiniteLoop;

        this.media = new Media(src, successCallback, errorCallback, (status: number) => {
            this.changeStatus(status);

            this.tryInfiniteLoop();

            if(!!statusCallback)
                statusCallback();
        });
    }

    private tryInfiniteLoop = () => {
        if (this.infiniteLoop && this.status === Media.MEDIA_STOPPED)
            this.media.play();
    }

    private changeStatus = (status: number) => {
        this.status = status;
    }

    public Replay = () : void => {
        if (this.status === Media.MEDIA_STARTING ||
            this.status === Media.MEDIA_RUNNING ||
            this.status === Media.MEDIA_PAUSED)
            this.media.stop();

        this.media.play();
    }

    public Play = (): void => {
        this.media.play();
    }
    
    public SetVolume = (volume : number): void => {
        this.media.setVolume(volume);
    }

    Preload(): void {
        if (this.mediaLoaded)
            return;

        this.media.setVolume(0.001);
        this.media.play();
        this.media.setVolume(1);
    }
}