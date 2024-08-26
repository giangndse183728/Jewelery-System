using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;
namespace Repositories.Interface
{
    public interface IUserRepository : IReadRepository<User>, IFindRepository<User>, ICreateRepository<User>, IUpdateRepository<User>, IDeleteRepository<User>
    {
        public Task<User?> GetUser(string email, string password);
        Task<IEnumerable<User>?> Gets(int? roleId, int? counterId, bool? hasCounter);
    }
}
