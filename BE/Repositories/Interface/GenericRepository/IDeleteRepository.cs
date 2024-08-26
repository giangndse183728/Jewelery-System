namespace Repositories.Interface.GenericRepository
{
    public interface IDeleteRepository<T>
    {
        Task<int> Delete(int id);
    }
}
