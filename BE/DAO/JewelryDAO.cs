using BusinessObjects.Context;
using BusinessObjects.DTO;
using BusinessObjects.Models;
using BusinessObjects.Utils;
using Domain.Constants;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class JewelryDao
    {
        private readonly JssatsContext _context;
        private readonly SessionContext _sessionContext;
        public JewelryDao(SessionContext sessionContext)
        {
            _context = new JssatsContext();
            _sessionContext = sessionContext;
        }

        public async Task<IEnumerable<Jewelry>> GetJewelriesDetails(EnumBillType? type)
        {
            var query = _context.Jewelries
                .Include(j => j.JewelryCounters)
                    .ThenInclude(j => j.Counter)
                .Include(j => j.JewelryType)
                .Include(j => j.JewelryMaterials)
                    .ThenInclude(jm => jm.Gem)
                .Include(j => j.JewelryMaterials)
                    .ThenInclude(jm => jm.Gold)
                .OrderByDescending(x => x.UpdatedAt)
                    .ThenByDescending(x => x.CreatedAt)
                .AsQueryable();

            if (type != null && type == EnumBillType.Sale)
            {
                query = query.Where(j => j.Type == EnumBillType.Sale);
            }

            if (_sessionContext.RoleId != (int)AppRole.Admin && _sessionContext.RoleId != (int)AppRole.Manager)
            {
                query = query.Where(j => j.JewelryCounters.Any(jc => jc.CounterId == _sessionContext.CounterId));
            }

            return await query.ToListAsync();
        }

        public async Task<Jewelry?> GetJewelryById(int id)
        {
            var jewelry = await _context.Jewelries.FirstOrDefaultAsync(p => p.JewelryId == id);
            return jewelry;
        }
        public async Task<int> CreateJewelry(Jewelry jewelry)
        {
            // kiểm tra xem jewelry.Code đã tồn tại chưa
            var existingJewelry = await _context.Jewelries
                .FirstOrDefaultAsync(w => w.Code.Trim().ToLower() == jewelry.Code.Trim().ToLower());
            if (existingJewelry != null) return 0;
            _context.Jewelries.Add(jewelry);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateJewelry(int id, Jewelry jewelry)
        {
            // kiểm tra xem jewelry có tồn tại không
            var existingJewelry = await _context.Jewelries
                .FirstOrDefaultAsync(w => w.JewelryId == id);

            jewelry.JewelryId = id;
            if (existingJewelry == null) return 0;
            foreach (var material in jewelry.JewelryMaterials)
            {
                material.JewelryId = id;
            }

            // kiểm tra xem jewelry.Code đã tồn tại chưa
            var existingJewelryWithCode = await _context.Jewelries
                .FirstOrDefaultAsync(w => w.Code.Trim().ToLower() == jewelry.Code.Trim().ToLower() && w.JewelryId != id);

            if (existingJewelryWithCode != null) return 0;
            try
            {
                _context.Database.BeginTransaction();
                bool hasChangeImage = existingJewelry.PreviewImage != jewelry.PreviewImage;
                _context.Entry(existingJewelry).CurrentValues.SetValues(jewelry);
                existingJewelry.JewelryMaterials = jewelry.JewelryMaterials;
                existingJewelry.UpdatedAt = DateTime.Now;
                _context.Entry(existingJewelry).State = EntityState.Modified;

                var oldJewelryCounter = _context.JewelryCounters.Where(x => x.JewelryId == existingJewelry.JewelryId);
                if (oldJewelryCounter.Count() > 0)
                {
                    _context.JewelryCounters.RemoveRange(oldJewelryCounter);
                }

                // nếu jewelry.JewelryCounters.length = 0 thì xóa hết dữ liệu trong bảng JewelryCounter
                if (jewelry.JewelryCounters.Count == 0)
                {
                    var jewelryCounters = new List<JewelryCounter>();
                    var counters = _context.Counters;
                    if (counters.Any())
                    {
                        foreach (var item in counters)
                        {
                            jewelryCounters.Add(new JewelryCounter
                            {
                                CounterId = item.CounterId,
                                JewelryId = existingJewelry.JewelryId
                            });
                        }
                        _context.JewelryCounters.AddRange(jewelryCounters);
                    }
                }
                else
                {
                    var jewelryCounters = jewelry.JewelryCounters;
                    foreach (var item in jewelryCounters)
                    {
                        item.JewelryId = existingJewelry.JewelryId;
                        item.Counter = null;
                        item.Jewelry = null;
                    }
                    _context.JewelryCounters.AddRange(jewelryCounters);

                }

                int result = await _context.SaveChangesAsync();
                _context.Database.CommitTransaction();
                if (result > 0)
                {
                    if (hasChangeImage)
                    {
                        FileUtil.DeleteFile(existingJewelry.PreviewImage, EnumFileType.Jewellery);
                        FileUtil.SaveTempToReal(jewelry.PreviewImage, EnumFileType.Jewellery);
                    }
                    return result;
                }
            }
            catch (Exception ex)
            {
                _context.Database.RollbackTransaction();
            }
            return 0;
        }
        public async Task<int> DeleteJewelry(int id)
        {
            var jewelry = await _context.Jewelries
                .Include(x => x.JewelryMaterials)
                .FirstOrDefaultAsync(x => x.JewelryId == id);

            if (jewelry != null)
            {
                // Remove related JewelryMaterials explicitly
                _context.JewelryMaterials.RemoveRange(jewelry.JewelryMaterials);

                // Now remove the Jewelry
                _context.Jewelries.Remove(jewelry);

                return await _context.SaveChangesAsync();
            }
            return 0;
        }
        public async Task<bool> IsSold(int id)
        {
            var jewelry = await _context.Jewelries.FindAsync(id);
            return jewelry?.IsSold ?? false;
        }
        public async Task<IEnumerable<Jewelry>> GetJewelriesByBillId(int billId)
        {
            return await _context.Jewelries
                .Where(j => j.BillJewelries.Any(bj => bj.BillId == billId))
                .ToListAsync();
        }
    }
}
