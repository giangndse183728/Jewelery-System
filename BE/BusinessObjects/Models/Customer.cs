namespace BusinessObjects.Models;

/// <summary>
/// Khách hàng
/// </summary>
public partial class Customer
{
    public int CustomerId { get; set; }
    public string? Code { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public int Point { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public virtual ICollection<Bill> Bills { get; set; } = [];
    public virtual ICollection<Warranty> Warranties { get; set; } = [];
    public virtual ICollection<CustomerPromotion> CustomerPromotions { get; set; } = [];
}
