using System.Linq;
using System.Web.Mvc;
using Images.Records;

namespace Images.Controllers
{
    public class PictureKeyController : BaseController
    {
        private readonly IPictureKeyRepository pictureKeyRepository;

        public PictureKeyController()
        {
            pictureKeyRepository = new PictureKeyRepository(UnitOfWork);
        }

        public ActionResult Index()
        {
            var keys = pictureKeyRepository.Query()
                .Select(p => p.Value)
                .ToList();
            
            return Json(keys, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Keys()
        {
            var keys = pictureKeyRepository.Query()
                .Select(p => p.Value)
                .ToList();

            var result = string.Join("\n", keys);

            return View((object)result);
        }

        [HttpPost]
        public ActionResult Keys(FormCollection collection, string keys)
        {
            pictureKeyRepository.RemoveAll();
            foreach (var key in keys.Split('\n'))
            {
                pictureKeyRepository.Add(new PictureKeyRecord { Value = key.Replace("\r", string.Empty) });
            }

            return RedirectToAction("Keys");
        }
    }
}