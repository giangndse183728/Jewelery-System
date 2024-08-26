namespace BusinessObjects.DTO.Jewelry;

public class JewelryMaterialRequestDto
{
    public int? GemId { get; set; }
    public int? GoldId { get; set; }

    public decimal? GoldWeight { get; set; } = 0;
    public decimal? GemQuantity { get; set; } = 0;

    public int JewelryMaterialId { get; set; }
}