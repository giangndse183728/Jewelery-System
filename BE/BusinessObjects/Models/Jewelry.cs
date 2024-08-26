using Domain.Constants;

namespace BusinessObjects.Models;

/// <summary>
/// Trang sức
/// </summary>
public partial class Jewelry
{
    public int JewelryId { get; set; }
    public int JewelryTypeId { get; set; }
    public string? Code { get; set; }
    // public string? Name { get; set; }
    public string? Barcode { get; set; }
    public decimal? LaborCost { get; set; }
    public bool? IsSold { get; set; }
    public string? PreviewImage { get; set; }
    public int? WarrantyTime { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public EnumBillType Type { get; set; } = EnumBillType.Sale;

    public virtual ICollection<BillJewelry> BillJewelries { get; set; } = [];
    public virtual JewelryType? JewelryType { get; set; }
    public virtual ICollection<Warranty> Warranties { get; set; } = [];
    public virtual ICollection<JewelryMaterial> JewelryMaterials { get; set; } = [];
    public virtual ICollection<JewelryCounter> JewelryCounters { get; set; } = [];
}
