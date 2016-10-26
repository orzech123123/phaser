using Images.Services;
using NHibernate;

namespace Images.Records
{
    public interface IPictureKeyRepository : IRepository<PictureKeyRecord>
    {
        
    }

    public class PictureKeyRepository : Repository<PictureKeyRecord>, IPictureKeyRepository
    {
        public PictureKeyRepository(IUnitOfWork uow) : base(uow)
        {
        }
    }
}