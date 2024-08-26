using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class GoldPriceRepository(GoldPriceDao goldPriceDao) : IGoldPriceRepository
{
    public GoldPriceDao GoldPriceDao { get; } = goldPriceDao;

    public async Task<IEnumerable<Gold?>?> Gets()
    {
        return await GoldPriceDao.GetGoldPrices();
    }

    public Task<Gold?> GetById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<int> Create(Gold entity)
    {
        return await GoldPriceDao.Create(entity);
    }

    public async Task<int> Update(Gold entity)
    {
        return await GoldPriceDao.Update(entity);
    }

    public async Task UpdateBatch(List<Gold> goldPrices)
    {
        await GoldPriceDao.UpdateBatch(goldPrices);
    }

    public async Task CreateBatch(List<Gold> goldPrices)
    {
        await GoldPriceDao.CreateBatch(goldPrices);
    }
}