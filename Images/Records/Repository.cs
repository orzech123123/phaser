using System.Linq;
using Images.Services;
using NHibernate;
using NHibernate.Linq;

namespace Images.Records
{
    public interface IRepository<T>
    {
        void Add(T entity);
        T Get(int id);
        void Remove(T entity);
        IQueryable<T> Query();
        void RemoveAll();
    }

    public class Repository<T> : IRepository<T>
    {
        private readonly IUnitOfWork _uow;

        private ISession session
        {
            get { return _uow.Session; }
        }

        public Repository(IUnitOfWork uow)
        {
            _uow = uow;
        }
        
        public void Add(T entity)
        {
            session.Save(entity);
        }

        public T Get(int id)
        {
            return session.Get<T>(id);
        }
        
        public void Remove(T entity)
        {
            session.Delete(entity);
        }

        public IQueryable<T> Query()
        {
            return session.Query<T>().AsQueryable();
        }

        public void RemoveAll()
        {
            var records = Query().ToList();
            foreach (var record in records)
                session.Delete(record);
        }
    }
}