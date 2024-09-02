using BusinessObjects.DTO.Jewelry;
using Domain.Constants;

namespace BusinessObjects.DTO.ResponseDto;

public class JewelryResponseDto
{
    public int JewelryId { get; set; }
    public string? Name { get; set; }
    public string? JewelryType { get; set; }
    public string? Barcode { get; set; }
    public decimal? LaborCost { get; set; }
    public decimal JewelryPrice { get; set; }
    public int? JewelryTypeId { get; set; }
    public string? Code { get; set; }
    public bool? IsSold { get; set; }
    public string? PreviewImage { get; set; }
    public int? WarrantyTime { get; set; }
    public EnumBillType Type { get; set; }
    public IList<Materials>? Materials { get; set; }
    public ICollection<JewelryCounterDTO>? JewelryCounters { get; set; }
    public decimal TotalPrice { get; set; }
}