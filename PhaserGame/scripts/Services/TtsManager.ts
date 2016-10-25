interface ITtsManager extends IPreload {
    PlayAudio(sentence : string): void;
}

class TtsManager implements ITtsManager {
    private game: PhaserGame;
    private ttsProvider: ITtsProvider;
    private mediaMap: Map<ExtraMedia>;

    constructor(game: PhaserGame) {
        this.game = game;
        this.ttsProvider = new TtsProvider();
        this.mediaMap = {};
    }

    public Preload(): void {
        for (let index in PictureKeys.Instance.Keys) {
            let key = PictureKeys.Instance.Keys[index];
            this.mediaMap[key] = new ExtraMedia(this.ttsProvider.GetAudioUrl(key), null, null, null);
            this.mediaMap[key].Preload();
        };
    }

    public PlayAudio(sentence: string): void {
        var audio = this.mediaMap[sentence];
        if (!audio)
            return;

        audio.Replay();
    }
}