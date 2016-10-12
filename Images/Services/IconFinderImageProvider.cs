using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Images.Services
{
    public interface IImageProvider
    {
        FileStreamResult GetImage(string url);
    }

    public class IconFinderImageProvider : IImageProvider
    {
        public FileStreamResult GetImage(string url)
        {
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.AutomaticDecompression = DecompressionMethods.GZip;

            using (var response = (HttpWebResponse)request.GetResponse())
            using (var stream = response.GetResponseStream())
            using (var reader = new StreamReader(stream))
            {
                var html = reader.ReadToEnd();
                return GetFromHtml(html);
            }
        }

        private static FileStreamResult GetFromHtml(string html)
        {
            var htmlDoc = new HtmlAgilityPack.HtmlDocument
            {
                OptionFixNestedTags = true
            };

            htmlDoc.LoadHtml(html);

            var iconUrls = htmlDoc.DocumentNode.SelectNodes("//*[contains(@class,'tiled-icon')]")
                .Select(i => i.Attributes)
                .SelectMany(c => c.Where(a => a.Name == "src").Select(a => a))
                .Select(a => a.Value)
                .ToList();

            if (!iconUrls.Any())
                return null;

            var webClient = new WebClient();
            var data = webClient.DownloadData(iconUrls[0]);
            return new FileStreamResult(new MemoryStream(data), "image/png");
        }
    }
}