

class ImageProvider {
    GetImageUrl = (q: string, style?: string) : string => {
        var url = "http://localhost:3654/home/index?";
        url = url + "q=" + q;
        if (!!style)
            url = url + "&style=" + style;

        return url;
    }
}