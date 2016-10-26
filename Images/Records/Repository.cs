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

        protected ISession Session
        {
            get { return _uow.Session; }
        }

        public Repository(IUnitOfWork uow)
        {
            _uow = uow;
        }
        
        public void Add(T entity)
        {
            Session.Save(entity);
        }

        public T Get(int id)
        {
            return Session.Get<T>(id);
        }
        
        public void Remove(T entity)
        {
            Session.Delete(entity);
        }

        public IQueryable<T> Query()
        {
            return Session.Query<T>().AsQueryable();
        }

        public void RemoveAll()
        {
            var records = Query().ToList();
            foreach (var record in records)
                Session.Delete(record);
        }
    }
}