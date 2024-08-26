using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;
namespace Repositories.Interface;

public interface IWarrantyRepository : IReadRepository<Warranty>, ICreateRepository<Warranty>, IUpdateRepository<Warranty>
{

}
