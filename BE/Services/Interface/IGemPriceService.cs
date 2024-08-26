
using BusinessObjects.DTO.ResponseDto;
namespace Services.Interface;

public interface IGemPriceService
{
    Task<IEnumerable<GemPriceResponseDto>> GetGemPrices();
}