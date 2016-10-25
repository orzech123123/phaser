using System.IO;
using System.Text;
using System.Web.Mvc;

namespace Images.Controllers
{
    public class PictureKeyController : Controller
    {
        private static readonly string path = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/keys.txt");

        public ActionResult Index()
        {
            var keysString = System.IO.File.Exists(path) ? System.IO.File.ReadAllText(path, Encoding.UTF8) : string.Empty;

            var result = keysString.Split('\n');
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Change()
        {
            var keys = System.IO.File.Exists(path) ? System.IO.File.ReadAllText(path, Encoding.UTF8) : string.Empty;

            return View((object)keys);
        }

        [HttpPost]
        public ActionResult Change(FormCollection collection, string keys)
        {
            System.IO.File.WriteAllText(path, keys.Replace("\r", string.Empty));

            return RedirectToAction("Change");
        }
    }
}