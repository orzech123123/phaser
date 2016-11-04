class RequestHelper {
    static Get = (url : string) => {
        var httpreq = new XMLHttpRequest();
        httpreq.open("GET", url, false);
        httpreq.send(null);
        return httpreq.responseText;
    }
}