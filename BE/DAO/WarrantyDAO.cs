using BusinessObjects.Context;
using BusinessObjects.Models;
using DAO.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class WarrantyDao : Singleton<WarrantyDao>
    {
        private readonly JssatsContext _context;

        public WarrantyDao()
        {
            _context = new JssatsContext();
        }
        public async Task<IEnumerable<Warranty>?> GetWarranties()
        {
            return await _context.Warranties.ToListAsync();
        }
        public async Task<Warranty?> GetWarrantyById(int id)
        {
            return await _context.Warranties.FirstOrDefaultAsync(w => w.WarrantyId == id);
        }
        public async Task<int> CreateWarranty(Warranty warranty)
        {
            _context.Warranties.Add(warranty);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateWarranty(int id, Warranty warranty)
        {
            var existingWarranty = await _context.Warranties
                .FirstOrDefaultAsync(w => w.WarrantyId == id);
            warranty.WarrantyId = id;
            if (existingWarranty == null) return 0;
            _context.Entry(existingWarranty).CurrentValues.SetValues(warranty);
            _context.Entry(existingWarranty).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }
        public async Task<int> DeleteWarranty(int id)
        {
            var warranty = await _context.Warranties.FindAsync(id);
            if (warranty == null) return 0;
            _context.Warranties.Remove(warranty);
            return await _context.SaveChangesAsync();
        }
    }
}
