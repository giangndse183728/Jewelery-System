
namespace Repositories.Interface.GenericRepository
{
    public interface IUpdateRepository<T>
    {
        Task<int> Update(int id, T entity);
    }
}
