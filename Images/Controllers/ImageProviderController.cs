using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Images.Records;
using Images.Services;

namespace Images.Controllers
{
    public class ImageProviderController : BaseController
    {
        private readonly IImageProvider imageProvider;
        private readonly IPictureImageRepository pictureImageRepository;

        public ImageProviderController()
        {
            imageProvider = new IconFinderImageProvider();
            pictureImageRepository = new PictureImageRepository(UnitOfWork);
        }

        //id = "q=honey&style=handdrawn";
        public ActionResult IconFinder(string q, string style = null)
        {
            var image = pictureImageRepository.GetByValue(q);
            if (image != null)
                return ResultFromPictureImage(image);

            var url = BuildIconFinderUrl(q, style);
            var result = imageProvider.GetImage(url);

            if (result == null && !string.IsNullOrWhiteSpace(style))
            {
                url = BuildIconFinderUrl(q);
                result = imageProvider.GetImage(url);
            }

            return result;
        }

        private ActionResult ResultFromPictureImage(PictureImageRecord pictureImage)
        {
            using (var ms = new MemoryStream(pictureImage.Image))
            {
                var image = Image.FromStream(ms);

                var format = "";
                if (ImageFormat.Jpeg.Equals(image.RawFormat))
                    format = "jpeg";
                else if (ImageFormat.Png.Equals(image.RawFormat))
                    format = "png";
                else if (ImageFormat.Gif.Equals(image.RawFormat))
                    format = "gif";
                else if (ImageFormat.Bmp.Equals(image.RawFormat))
                    format = "bmp";

                ms.Seek(0, SeekOrigin.Begin);
                
                var imageMs = new MemoryStream();
                image.Save(imageMs, image.RawFormat);
                imageMs.Seek(0, SeekOrigin.Begin);

                return new FileStreamResult(imageMs, string.Format("image/{0}", format));
            }
        }

        private static string BuildIconFinderUrl(string q, string style = null)
        {
            var urlPartBuilder = new StringBuilder();
            urlPartBuilder.Append($"q={q}");
            if (!string.IsNullOrWhiteSpace(style))
                urlPartBuilder.Append($"&style={style}");
            var urlPart = urlPartBuilder.ToString();

            var url = $"https://www.iconfinder.com/search/?{urlPart}";
            return url;
        }
    }
}