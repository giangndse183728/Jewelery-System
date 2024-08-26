using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation
{
    public class PromotionRepository(PromotionDao promotionDao) : IPromotionRepository
    {
        public PromotionDao PromotionDao { get; } = promotionDao;

        public async Task<int> Create(Promotion promotion)
        {
            var result = await PromotionDao.CreatePromotion(promotion);
            return result;
        }

        public async Task<int> Delete(int id)
        {
            return await PromotionDao.DeletePromotion(id);
        }

        public async Task<IEnumerable<Promotion?>?> Gets()
        {
            return await PromotionDao.GetPromotions();
        }

        public Task<Promotion?> GetById(int id)
        {
            return PromotionDao.GetPromotionById(id);
        }

        public async Task<int> Update(int id, Promotion promotion)
        {
            return await PromotionDao.UpdatePromotion(id, promotion);
        }

        public async Task<IEnumerable<Promotion>?> Gets(bool available, int? customerId, bool isAdmin)
        {
            return await PromotionDao.GetPromotions(available, customerId, isAdmin);
        }
    }
}
