namespace Repositories.Interface.GenericRepository
{
    public interface ICreateRepository<T>
    {
        Task<int> Create(T entity);
    }
}
