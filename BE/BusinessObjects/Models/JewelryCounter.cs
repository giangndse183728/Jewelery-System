namespace BusinessObjects.Models
{
    public class JewelryCounter
    {
        public int JewelryCounterId { get; set; }
        public int JewelryId { get; set; }
        public int CounterId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        public virtual Jewelry Jewelry { get; set; }
        public virtual Counter Counter { get; set; }
    }
}
