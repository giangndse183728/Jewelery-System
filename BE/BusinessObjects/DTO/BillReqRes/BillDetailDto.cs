using BusinessObjects.Models;

namespace BusinessObjects.DTO.BillReqRes;

public class BillDetailDto
{
    public int Id { get; set; }
    public int BillId { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerAddress { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerCode { get; set; }
    public int CustomerId { get; set; }
    public string? StaffName { get; set; }
    public string? StaffCode { get; set; }
    public int UserId { get; set; }
    public int CounterId { get; set; }
    public decimal? DiscountRate { get; set; }
    public string? DiscountDescription { get; set; }
    public string? CounterName { get; set; }
    public decimal? TotalAmount { get; set; }
    public bool? PaymentStatus { get; set; }
    public DateTimeOffset? SaleDate { get; set; }
    public List<BillJewelry?> Items { get; set; } = [];
    public List<BillPromotionCustomDTO?> Promotions { get; set; } = [];
    public List<Warranty?> Warranties { get; set; } = [];
}

public class BillPromotionCustomDTO : BillPromotion
{
    public string? Description { get; set; }
    public decimal? DiscountRate { get; set; }
}