namespace BusinessObjects.Models;

/// <summary>
/// Quầy hàng
/// </summary>
public partial class Counter
{
    public int CounterId { get; set; }
    /// <summary>
    /// Quầy ở vị trí số mấy
    /// </summary>
    public string? Name { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public virtual ICollection<User> Users { get; set; } = [];
    public virtual ICollection<Bill> Bills { get; set; } = [];
    public virtual ICollection<JewelryCounter> JewelryCounters { get; set; } = [];
}
