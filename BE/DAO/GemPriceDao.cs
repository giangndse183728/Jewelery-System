using BusinessObjects.Context;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace DAO;

public class GemPriceDao
{
    private readonly JssatsContext _context;
    public GemPriceDao()
    {
        _context = new JssatsContext();
    }
    public async Task<IEnumerable<Gem>> GetStonePrices()
    {
        return await _context.Gems.ToListAsync();
    }
    public async Task<Gem?> GetStonePriceById(int? id)
    {
        return await _context.Gems.FindAsync(id);
    }
    public async Task<int> Create(Gem gem)
    {
        _context.Gems.Add(gem);
        return await _context.SaveChangesAsync();
    }
    public async Task<int> Update(Gem gem)
    {
        _context.Gems.Update(gem);
        return await _context.SaveChangesAsync();
    }
}