using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class GemPriceRepository(GemPriceDao gemPriceDao) : IGemPriceRepository
{
    public GemPriceDao GemPriceDao { get; } = gemPriceDao;

    public async Task<IEnumerable<Gem>?> Gets()
    {
        return await GemPriceDao.GetStonePrices();
    }

    public async Task<Gem?> GetById(int id)
    {
        return await GemPriceDao.GetStonePriceById(id);
    }

    public async Task<int> Create(Gem entity)
    {
        return await GemPriceDao.Create(entity);
    }

    public async Task<int> Update(Gem entity)
    {
        return await GemPriceDao.Update(entity);
    }
}