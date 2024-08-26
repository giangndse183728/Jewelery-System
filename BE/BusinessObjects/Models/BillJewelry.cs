using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models;

/// <summary>
/// Chi tiết mặt hàng trang sức trong phiếu mua hàng
/// </summary>
public partial class BillJewelry
{
    public int BillJewelryId { get; set; }

    /// <summary>
    /// Đơn hàng
    /// </summary>
    public int BillId { get; set; }


    /// <summary>
    /// Trang sức
    /// </summary>
    public int JewelryId { get; set; }

    [NotMapped]
    public string? Code { get; set; }

    [NotMapped]
    public string? Name { get; set; }

    /// <summary>
    /// Order
    /// </summary>
    public int SortOrder { get; set; }

    /// <summary>
    /// Số lượng
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Tiền công
    /// </summary>
    public decimal? LaborCost { get; set; }

    /// <summary>
    /// Tiền đá tại thời điểm bán
    /// </summary>
    public decimal? GemSellPrice { get; set; }

    /// <summary>
    /// Loại đá
    /// </summary>
    public string? GemType { get; set; }

    /// <summary>
    /// Số lượng đá
    /// </summary>
    public decimal? StoneQuantity { get; set; }

    /// <summary>
    /// Tiền vàng tại thời điểm bán
    /// </summary>
    public decimal? GoldSellPrice { get; set; }

    /// <summary>
    /// Trọng lượng vàng
    /// </summary>
    public decimal? GoldWeight { get; set; }

    /// <summary>
    /// Loại vàng
    /// </summary>
    public string? GoldType { get; set; }


    /// <summary>
    /// Đơn giá
    /// </summary>
    public decimal? Price { get; set; }

    /// <summary>
    /// Thành tiền [giá vàng thời điểm * trọng lượng sản phẩm] + tiền công + tiền đá 
    /// </summary>
    public decimal? TotalAmount { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public virtual Bill? Bill { get; set; }
    public virtual Jewelry? Jewelry { get; set; }

    [NotMapped]
    public DateTimeOffset? Warranty { get; set; }
}
