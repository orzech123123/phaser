using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Images.Startup))]
namespace Images
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
