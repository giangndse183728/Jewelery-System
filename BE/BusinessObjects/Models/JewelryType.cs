namespace BusinessObjects.Models;

/// <summary>
/// Loại trang sức
/// </summary>
public partial class JewelryType
{
    public int JewelryTypeId { get; set; }
     public string? Name { get; set; }
    public virtual ICollection<Jewelry> Jewelries { get; set; } = [];
}
