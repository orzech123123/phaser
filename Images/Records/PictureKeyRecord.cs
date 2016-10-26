using FluentNHibernate.Mapping;

namespace Images.Records
{
    public class PictureKeyRecord
    {
        public virtual int Id { get; protected set; }
        public virtual string Value { get; set; }
    }

    public class PictureKeyMap : ClassMap<PictureKeyRecord>
    {
        public PictureKeyMap()
        {
            Id(k => k.Id);
            Map(k => k.Value).Not.Nullable();
        }
    }
}