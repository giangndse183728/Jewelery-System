namespace BusinessObjects.Models;

/// <summary>
/// Lưu thông tin gem
/// </summary>
public class Gem
{
    public int GemId { get; set; }
    public string? Type { get; set; }
    public string? City { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal SellPrice { get; set; }
    public DateTimeOffset LastUpdated { get; set; }

    public virtual ICollection<JewelryMaterial> JewelryMaterials { get; set; } = new List<JewelryMaterial>();
}