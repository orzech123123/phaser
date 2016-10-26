using FluentNHibernate.Mapping;

namespace Images.Records
{
    public class PictureImageRecord
    {
        public virtual int Id { get; protected set; }
        public virtual string Value { get; set; }
        public virtual byte[] Image { get; set; }
    }

    public class PictureImageMap : ClassMap<PictureImageRecord>
    {
        public PictureImageMap()
        {
            Id(i => i.Id);
            Map(i => i.Value).Not.Nullable();
            Map(i => i.Image).Not.Nullable().Length(int.MaxValue);
        }
    }
}