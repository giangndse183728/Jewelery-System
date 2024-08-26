namespace BusinessObjects.Models;

/// <summary>
/// Lưu thông tin vàng, giá vàng
/// </summary>
public partial class Gold
{
    public int GoldId { get; set; }
    public string? Type { get; set; }
    public string? City { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal SellPrice { get; set; }
    public DateTimeOffset? LastUpdated { get; set; }
    public DateTime? LastFetchTime { get; set; }

    public virtual IList<JewelryMaterial> JewelryMaterials { get; set; } = [];
}
