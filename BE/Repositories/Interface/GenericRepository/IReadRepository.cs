namespace Repositories.Interface.GenericRepository
{
    public interface IReadRepository<T>
    {
        Task<IEnumerable<T>?> Gets();
        Task<T?> GetById(int id);
    }
}
