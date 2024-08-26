using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class CounterRepository(CounterDAO jewelryTypeDao) : ICounterRepository
{
    public CounterDAO CounterDAO { get; } = jewelryTypeDao;

    public async Task<IEnumerable<Counter?>?> Gets()
    {
        return await CounterDAO.Gets();
    }

    public async Task<Counter?> GetById(int id)
    {
        return await CounterDAO.GetById(id);
    }

    public async Task<int> Create(Counter entity)
    {
        return await CounterDAO.Create(entity);
    }

    public async Task<int> Update(int id, Counter entity)
    {
        return await CounterDAO.Update(id, entity);
    }
}