using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;

namespace Repositories.Interface;

public interface IGemPriceRepository : IReadRepository<Gem>, ICreateRepository<Gem>
{
    Task<int> Update(Gem entity);
}