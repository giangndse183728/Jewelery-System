using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;

namespace Repositories.Interface;

public interface ICounterRepository : IReadRepository<Counter>, ICreateRepository<Counter>, IUpdateRepository<Counter>
{

}