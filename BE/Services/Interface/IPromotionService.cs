using BusinessObjects.DTO;
using BusinessObjects.Models;

namespace Services.Interface
{
    public interface IPromotionService
    {
        public Task<int> CreatePromotion(PromotionDto promotion);
        public Task<IEnumerable<PromotionDto?>?> GetPromotions(bool available, int? customerId);
        public Task<Promotion?> GetPromotionById(int id);
        public Task<int> UpdatePromotion(int id, PromotionDto promotion);
        public Task<int> DeletePromotion(int id);
    }
}
