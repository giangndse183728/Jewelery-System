using BusinessObjects.Context;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace DAO;

public class GoldPriceDao
{
    private readonly JssatsContext _context;
    public GoldPriceDao()
    {
        _context = new JssatsContext();
    }
    public async Task<IEnumerable<Gold>?> GetGoldPrices()
    {
        return await _context.Golds.ToListAsync();
    }
    public async Task<Gold?> GetGoldPriceById(int? id)
    {
        return await _context.Golds.FindAsync(id);
    }
    public async Task<int> Create(Gold gold)
    {
        _context.Golds.Add(gold);
        return await _context.SaveChangesAsync();
    }
    public async Task<int> Update(Gold gold)
    {
        _context.Golds.Update(gold);
        return await _context.SaveChangesAsync();
    }

    public async Task UpdateBatch(List<Gold> goldPrices)
    {
        _context.Golds.UpdateRange(goldPrices);
        await _context.SaveChangesAsync();
    }

    public async Task CreateBatch(List<Gold> goldPrices)
    {
        await _context.Golds.AddRangeAsync(goldPrices);
        await _context.SaveChangesAsync();
    }
}