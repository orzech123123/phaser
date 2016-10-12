using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Images.Services;

namespace Images.Controllers
{
    public class HomeController : Controller
    {
        private readonly IImageProvider imageProvider;

        public HomeController()
        {
            imageProvider = new IconFinderImageProvider();
        }

        //id = "q=honey&style=handdrawn";
        public ActionResult Index(string q, string style = null)
        {
            var urlPartBuilder = new StringBuilder();
            urlPartBuilder.Append($"q={q}");
            if (!string.IsNullOrWhiteSpace(style))
                urlPartBuilder.Append($"&style={style}");
            var urlPart = urlPartBuilder.ToString();

            var url = $"https://www.iconfinder.com/search/?{urlPart}";

            return imageProvider.GetImage(url);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}