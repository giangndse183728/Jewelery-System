using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;

namespace Repositories.Interface;

public interface IBillRepository : IReadRepository<Bill>, ICreateRepository<Bill>
{
    Task<int> CreateBill(Bill bill);
    Task<int> UpdateBill(Bill bill);
}
