using System.Linq;
using Images.Services;

namespace Images.Records
{
    public interface IPictureImageRepository : IRepository<PictureImageRecord>
    {
        PictureImageRecord GetByValue(string value);
    }

    public class PictureImageRepository : Repository<PictureImageRecord>, IPictureImageRepository
    {
        public PictureImageRepository(IUnitOfWork uow) : base(uow)
        {
        }

        public PictureImageRecord GetByValue(string value)
        {
            return Query().SingleOrDefault(i => i.Value.ToLower() == value.ToLower());
        }
    }
}