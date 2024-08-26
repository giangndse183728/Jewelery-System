using Domain.Constants;

namespace BusinessObjects.Models;

/// <summary>
/// Đơn bán hàng
/// </summary>
public partial class Bill
{
    public int BillId { get; set; }

    /// <summary>
    /// Khách hàng
    /// </summary>
    public int CustomerId { get; set; }

    /// <summary>
    /// Người bán
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Quầy bán
    /// </summary>
    public int CounterId { get; set; }

    /// <summary>
    /// DiscountRate
    /// </summary>
    public decimal? DiscountRate { get; set; }

    /// <summary>
    /// Discount Description
    /// </summary>
    public string? DiscountDescription { get; set; }

    /// <summary>
    /// Tổng tiền
    /// </summary>
    public decimal? TotalAmount { get; set; }

    /// <summary>
    /// Ngày bán
    /// </summary>
    public DateTimeOffset SaleDate { get; set; }

    /// <summary>
    /// Loại hóa đơn (1: Bán hàng, 2: Mua hàng)
    /// </summary>
    public EnumBillType Type { get; set; } = EnumBillType.Sale;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public virtual ICollection<BillJewelry> BillJewelries { get; set; } = new List<BillJewelry>();
    public virtual ICollection<BillPromotion> BillPromotions { get; set; } = new List<BillPromotion>();
    public virtual ICollection<Warranty> Warranties { get; set; } = new List<Warranty>();
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public virtual Customer? Customer { get; set; }
    public virtual User? User { get; set; }
    public virtual Counter? Counter { get; set; }
}
