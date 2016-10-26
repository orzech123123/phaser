using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Images.Records;

namespace Images.Controllers
{
    namespace Images.Controllers
    {
        public class PictureImageController : BaseController
        {
            private readonly IPictureImageRepository pictureImageRepository;

            public PictureImageController()
            {
                pictureImageRepository = new PictureImageRepository(UnitOfWork);
            }

            [HttpGet]
            public ActionResult Upload()
            {
                var images = pictureImageRepository.Query()
                    .Select(i => i.Value)
                    .ToList();

                return View(images);
            }

            [HttpPost]
            public ActionResult Upload(HttpPostedFileBase file, string key)
            {
                var image = pictureImageRepository.GetByValue(key);
                if(image != null)
                    pictureImageRepository.Remove(image);

                using (var ms = new MemoryStream())
                {
                    file.InputStream.CopyTo(ms);

                    ms.Seek(0, SeekOrigin.Begin);
                    
                    image = new PictureImageRecord
                    {
                        Value = key,
                        Image = ms.ToArray()
                    };
                    pictureImageRepository.Add(image);
                }
                

                return RedirectToAction("Upload");
            }
        }
    }
}