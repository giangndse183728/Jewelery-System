using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;

namespace Repositories.Interface;

public interface IJewelryTypeRepository : IReadRepository<JewelryType>, ICreateRepository<JewelryType>, IUpdateRepository<JewelryType>
{

}