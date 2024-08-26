using BusinessObjects.Context;
using BusinessObjects.Models;
using DAO.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class JewelryTypeDao : Singleton<JewelryTypeDao>
    {
        private readonly JssatsContext _context;
        public JewelryTypeDao()
        {
            _context = new JssatsContext();
        }
        public async Task<JewelryType?> GetJewelryTypeById(int id)
        {
            return await _context.JewelryTypes.FindAsync(id);
        }
        public async Task<IEnumerable<JewelryType>?> GetJewelryTypes()
        {
            return await _context.JewelryTypes.ToListAsync();
        }
        public async Task<int> CreateJewelryType(JewelryType jewelryType)
        {
            _context.JewelryTypes.Add(jewelryType);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateJewelryType(int id, JewelryType jewelryType)
        {
            var existingJewelryType = await _context.JewelryTypes
                .FirstOrDefaultAsync(w => w.JewelryTypeId == id);
            jewelryType.JewelryTypeId = id;
            if (existingJewelryType == null) return 0;
            _context.Entry(existingJewelryType).CurrentValues.SetValues(jewelryType);
            _context.Entry(existingJewelryType).State = EntityState.Modified;

            return await _context.SaveChangesAsync();
        }
    }
}
