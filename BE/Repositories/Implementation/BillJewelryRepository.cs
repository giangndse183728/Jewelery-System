using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class BillJewelryRepository(BillJewelryDao billJewelryDao) : IBillJewelryRepository
{
    public BillJewelryDao BillJewelryDao { get; } = billJewelryDao;

    public async Task<int> Create(BillJewelry entity)
    {
        return await BillJewelryDao.CreateBillJewelry(entity);
    }
}