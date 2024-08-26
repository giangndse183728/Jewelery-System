using BusinessObjects.Context;
using BusinessObjects.Models;
using DAO.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class CounterDAO : Singleton<CounterDAO>
    {
        private readonly JssatsContext _context;
        public CounterDAO()
        {
            _context = new JssatsContext();
        }
        public async Task<Counter?> GetById(int id)
        {
            return await _context.Counters.FindAsync(id);
        }
        public async Task<IEnumerable<Counter>?> Gets()
        {
            return await _context.Counters.Include(x => x.Users).OrderByDescending(x => x.UpdatedAt).ToListAsync();
        }
        public async Task<int> Create(Counter counter)
        {
            var couterExisted = await _context.Counters.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == counter.Name.ToLower().Trim());
            if (couterExisted != null) return 0;
            counter.CreatedAt = DateTime.Now;
            counter.UpdatedAt = DateTime.Now;
            _context.Counters.Add(counter);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> Update(int id, Counter counter)
        {
            var existingCounter = await _context.Counters
                .FirstOrDefaultAsync(w => w.CounterId == id);
            counter.CounterId = id;
            counter.UpdatedAt = DateTime.Now;
            if (existingCounter == null) return 0;
            _context.Entry(existingCounter).CurrentValues.SetValues(counter);
            _context.Entry(existingCounter).State = EntityState.Modified;

            return await _context.SaveChangesAsync();
        }
    }
}
