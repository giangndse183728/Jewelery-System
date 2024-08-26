namespace BusinessObjects.Models;

/// <summary>
/// Bảng giảm giá
/// </summary>
public partial class Promotion
{
    public int PromotionId { get; set; }
    public string? Type { get; set; }
    public string? ApproveManager { get; set; }
    public string? Description { get; set; }
    public decimal? DiscountRate { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }

    public virtual ICollection<BillPromotion> BillPromotions { get; set; } = [];

    public virtual ICollection<CustomerPromotion> CustomerPromotions { get; set; } = [];
}
