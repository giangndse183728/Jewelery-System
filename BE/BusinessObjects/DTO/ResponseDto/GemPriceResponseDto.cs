namespace BusinessObjects.DTO.ResponseDto;

public class GemPriceResponseDto
{
    public int GemId { get; set; }
    public string? Type { get; set; }
    public string? City { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal SellPrice { get; set; }
    public DateTimeOffset? LastUpdated { get; set; }
}