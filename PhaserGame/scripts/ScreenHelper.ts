class ScreenHelper {
    static GetScreenWidth =() : number => {
        return window.screen.width;
    }

    static GetScreenHeight = (): number => {
        return window.screen.height;
    }

    static ScaleByScreenWidth = (sprite : PIXI.Sprite, scale : number) => {
        if (scale < 0 || scale > 1)
            throw "ScaleByScreenWidth: ArgumentException";
            
        var targetWidth = ScreenHelper.GetScreenWidth() * scale;
        var targetScale = targetWidth / sprite.width;
        sprite.scale.x = targetScale;
        sprite.scale.y = targetScale;
    }
}