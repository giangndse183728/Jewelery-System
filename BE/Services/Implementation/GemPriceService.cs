using AutoMapper;
using BusinessObjects.DTO.ResponseDto;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation;

public class GemPriceService(IMapper mapper, IGemPriceRepository gemPriceRepository) : IGemPriceService
{
    private IMapper Mapper { get; } = mapper;
    private IGemPriceRepository GemPriceRepository { get; } = gemPriceRepository;

    public async Task<IEnumerable<GemPriceResponseDto>> GetGemPrices()
    {
        var gemPrices = await GemPriceRepository.Gets();
        return Mapper.Map<IEnumerable<GemPriceResponseDto>>(gemPrices);
    }
}