using BusinessObjects.Context;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class BillDao
    {
        private readonly JssatsContext _context = new();
        public async Task<IEnumerable<Bill>> GetBills()
        {
            return await _context.Bills.ToListAsync();
        }

        public async Task<Bill?> GetBillById(int id)
        {
            return await _context.Bills.FindAsync(id);
        }

        public async Task<int> CreateBill(Bill bill)
        {
            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            return bill.BillId;
        }
        public async Task<int> UpdateBill(Bill bill)
        {
            _context.Bills.Update(bill);
            return await _context.SaveChangesAsync();
        }
    }
}
