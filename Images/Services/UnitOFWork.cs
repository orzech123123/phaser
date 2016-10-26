using System;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using Images.Records;
using NHibernate;
using NHibernate.Tool.hbm2ddl;

namespace Images.Services
{
    public interface IUnitOfWork : IDisposable
    {
        ISession Session { get; }
        void BeginTransaction();
        void Commit();
        void Rollback();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private static readonly ISessionFactory _sessionFactory;
        private ITransaction _transaction;

        public ISession Session { get; private set; }

        static UnitOfWork()
        {
            _sessionFactory = Fluently.Configure()
                    .Database(MsSqlConfiguration.MsSql2012
                    .ConnectionString(cs => cs.FromConnectionStringWithKey("Images")))
                    .Mappings(m => m.FluentMappings.AddFromAssemblyOf<PictureKeyRecord>())
                    .ExposeConfiguration(config =>
                    {
                        var schemaExport = new SchemaExport(config);
                        schemaExport.Create(false, true);
                    })
                    .BuildSessionFactory();
        }

        public UnitOfWork()
        {
            Session = _sessionFactory.OpenSession();
        }

        public void BeginTransaction()
        {
            _transaction = Session.BeginTransaction();
        }

        public void Commit()
        {
            try
            {
                // commit transaction if there is one active
                if (_transaction != null && _transaction.IsActive)
                    _transaction.Commit();
            }
            catch
            {
                // rollback if there was an exception
                if (_transaction != null && _transaction.IsActive)
                    _transaction.Rollback();

                throw;
            }
            finally
            {
                //Session.Dispose();
            }
        }

        public void Rollback()
        {
            try
            {
                if (_transaction != null && _transaction.IsActive)
                    _transaction.Rollback();
            }
            finally
            {
                //Session.Dispose();
            }
        }

        public void Dispose()
        {
            Session.Dispose();
        }
    }
}