namespace BusinessObjects.DTO;
public class PromotionDto
{
    public int? PromotionId { get; set; }
    public string? Type { get; set; }
    public string? ApproveManager { get; set; }
    public string? Description { get; set; }
    public decimal? DiscountRate { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public virtual ICollection<CustomerPromotionDTO> CustomerPromotions { get; set; } = [];
}

public class CustomerPromotionDTO
{
    public int? CustomerPromotionId { get; set; }
    public int? PromotionId { get; set; }
    public int? CustomerId { get; set; }
    public string? FullName { get; set; }
}