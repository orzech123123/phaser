interface ITtsProvider {
    GetAudioUrl(sentence : string) : string;
}

class TtsProvider implements ITtsProvider {
    public GetAudioUrl(sentence: string): string {
        return "http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=" + sentence + "&tl=Pl-pl";
    }
}