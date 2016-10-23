/// <reference path="../www/scripts/typings/phaser.d.ts" />

interface ITtsManager extends IPreload {
    PlayAudio(sentence : string): void;
}

class TtsManager implements ITtsManager {
    private game: PhaserGame;
    private ttsProvider: ITtsProvider;
    private mediaMap : Map<Media>;

    constructor(game: PhaserGame) {
        this.game = game;
        this.ttsProvider = new TtsProvider();
        this.mediaMap = {};
    }

    public Preload(): void {
        for (let index in PictureKeys.Keys) {
            let key = PictureKeys.Keys[index];
            this.mediaMap[key] = new Media(this.ttsProvider.GetAudioUrl(key), null, null);
        };
    }

    public PlayAudio(sentence: string): void {
        var audio = this.mediaMap[sentence];
        if (!audio)
            return;

        audio.play();
    }
}