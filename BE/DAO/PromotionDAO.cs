using BusinessObjects.Context;
using BusinessObjects.Models;
using DAO.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class PromotionDao : Singleton<PromotionDao>
    {
        private readonly JssatsContext _context;

        public PromotionDao()
        {
            _context = new JssatsContext();
        }

        public async Task<IEnumerable<Promotion>> GetPromotions(bool available = false, int? customerId = null, bool isAdmin = false)
        {
            var query = _context.Promotions.AsQueryable();
            query = query.Include(x => x.CustomerPromotions)
                .ThenInclude(x => x.Customer);

            if (!isAdmin)
            {
                if (customerId != null)
                {
                    // nếu truyền customerId thì lấy promotion không có customer hoặc có customer đó
                    query = query.Where(x => x.CustomerPromotions == null || x.CustomerPromotions.Count == 0 || x.CustomerPromotions.Any(y => y.CustomerId == customerId));
                }
                else
                {
                    // nếu không truyền customerId thì chỉ lấy promotion không có customer
                    query = query.Where(x => x.CustomerPromotions == null || x.CustomerPromotions.Count == 0);
                }

                if (available)
                {
                    query = query.Where(x => x.StartDate.Value.Date <= DateTimeOffset.Now.Date && x.EndDate.Value.Date >= DateTimeOffset.Now.Date);
                }
            }

            return await query.ToListAsync();
        }
        public async Task<Promotion?> GetPromotionById(int id)
        {
            return await _context.Promotions.FindAsync(id);
        }
        public async Task<int> CreatePromotion(Promotion promotion)
        {
            await _context.Promotions.AddAsync(promotion);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdatePromotion(int id, Promotion promotion)
        {
            var existPromotion = await _context.Promotions.FirstOrDefaultAsync(x => x.PromotionId == id);
            if (existPromotion == null) return 0;
            int result = 0;
            try
            {
                _context.Database.BeginTransaction();
                existPromotion.Type = promotion.Type;
                existPromotion.Description = promotion.Description;
                existPromotion.EndDate = promotion.EndDate;
                existPromotion.StartDate = promotion.StartDate;
                existPromotion.ApproveManager = promotion.ApproveManager;
                existPromotion.DiscountRate = promotion.DiscountRate;
                _context.CustomerPromotions.RemoveRange(_context.CustomerPromotions.Where(x => x.PromotionId == id));
                if (promotion.CustomerPromotions.Count != 0)
                {
                    foreach (var item in promotion.CustomerPromotions)
                    {
                        item.PromotionId = id;
                        item.Customer = null;
                        item.Promotion = null;
                    }
                    _context.CustomerPromotions.AddRange(promotion.CustomerPromotions);
                }
                result = await _context.SaveChangesAsync();
                _context.Database.CommitTransaction();
            }
            catch (Exception ex)
            {
                _context.Database.RollbackTransaction();
            }
            return result;
        }
        public async Task<int> DeletePromotion(int id)
        {
            var existPromotion = await _context.Promotions.FirstOrDefaultAsync(x => x.PromotionId == id);
            if (existPromotion == null) return 0;
            _context.Remove(existPromotion);
            return await _context.SaveChangesAsync();
        }
    }
}