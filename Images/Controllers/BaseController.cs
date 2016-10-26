using System.Web.Mvc;
using Images.Services;

namespace Images.Controllers
{
    public class BaseController : Controller
    {
        protected UnitOfWork UnitOfWork { get; set; }

        public BaseController()
        {
            UnitOfWork = new UnitOfWork();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            UnitOfWork.BeginTransaction();

            base.OnActionExecuting(filterContext);
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            this.UnitOfWork.Commit();
            this.UnitOfWork.Dispose();

            base.OnActionExecuted(filterContext);
        }
    }
}