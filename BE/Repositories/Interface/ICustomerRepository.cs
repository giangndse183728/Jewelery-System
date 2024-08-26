using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;

namespace Repositories.Interface
{
    public interface ICustomerRepository : IReadRepository<Customer>, ICreateRepository<Customer>, IUpdateRepository<Customer>, IDeleteRepository<Customer>
    {
    }
}
