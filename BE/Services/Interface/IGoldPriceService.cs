using BusinessObjects.DTO.ResponseDto;
namespace Services.Interface;

public interface IGoldPriceService
{
    Task<IEnumerable<GoldPriceResponseDto>?> GetGoldPrices();
}