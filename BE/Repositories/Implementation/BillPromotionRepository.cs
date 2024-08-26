using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class BillPromotionRepository(BillPromotionDao billPromotionDao) : IBillPromotionRepository
{
    public BillPromotionDao BillPromotionDao { get; } = billPromotionDao;

    public async Task<int> Create(BillPromotion entity)
    {
        return await BillPromotionDao.CreateBillPromotion(entity);
    }
}