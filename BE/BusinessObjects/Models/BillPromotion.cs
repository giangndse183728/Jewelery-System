namespace BusinessObjects.Models;

/// <summary>
/// Thông tin giảm giá
/// </summary>
public partial class BillPromotion
{
    public int BillPromotionId { get; set; }

    /// <summary>
    /// Mã đơn hàng
    /// </summary>
    public int BillId { get; set; }

    /// <summary>
    /// Phiếu giảm giá
    /// </summary>
    public int PromotionId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public virtual Bill? Bill { get; set; }
    public virtual Promotion? Promotion { get; set; }
}
