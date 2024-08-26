

namespace BusinessObjects.Models
{
    public class CustomerPromotion
    {
        public int CustomerPromotionId { get; set; }
        public int PromotionId { get; set; }
        public int CustomerId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public virtual Promotion? Promotion { get; set; }
        public virtual Customer? Customer { get; set; }
    }
}
