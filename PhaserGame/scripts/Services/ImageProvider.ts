interface IImageProvider {
    GetImageUrl(q: string, style?: string) : string;
}

class ImageProvider implements IImageProvider {
    public GetImageUrl = (q: string, style?: string) : string => {
        return this.getFromIconFinder(q, style);
        return this.getFromImageStock(q);
    }

    private getFromIconFinder = (q: string, style?: string): string => {
        var url = "http://www.orzechservices.aspnet.pl/imageprovider/iconfinder?";
        //var url = "http://localhost:3654/imageprovider/iconfinder?";
        url = url + "q=" + q;
        if (!!style)
            url = url + "&style=" + style;
            
        url = url + "&stamp=" + Date.now();

        return url;
    }

    private getFromImageStock = (q : string) : string => {
        var jsonObj = JSON.parse(RequestHelper.Get("http://testapi.bigstockphoto.com/2/883610/search/?q=" + q));

        var images = new Array<string>();
        for (let i in jsonObj.data.images) {
            const image = jsonObj.data.images[i].small_thumb.url;
            images.push(image);
        }

        return images[0];
    }
}