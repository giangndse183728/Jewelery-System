namespace BusinessObjects.DTO.ResponseDto;

public class Materials
{
    public GoldResponseDto? Gold { get; set; }
    public GemResponseDto? Gem { get; set; }
    public int JewelryMaterialId { get; set; }
}