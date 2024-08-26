using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using Domain.Constants;
using Repositories.Interface.GenericRepository;
namespace Repositories.Interface;

public interface IJewelryRepository : IReadRepository<JewelryResponseDto>, ICreateRepository<Jewelry>, IUpdateRepository<Jewelry>, IDeleteRepository<Jewelry>
{
    Task<IEnumerable<JewelryResponseDto>?> Gets(EnumBillType? type);
}
