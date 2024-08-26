namespace BusinessObjects.DTO.Bill;

public class BillItemResponse
{
    public int JewelryId { get; set; }
    public string? Name { get; set; }
    public decimal JewelryPrice { get; set; }
    public decimal? LaborCost { get; set; }
    public decimal TotalPrice { get; set; }
}