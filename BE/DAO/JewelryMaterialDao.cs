using BusinessObjects.Context;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace DAO;

public class JewelryMaterialDao
{
    private readonly JssatsContext _context;
    public JewelryMaterialDao()
    {
        _context = new JssatsContext();
    }
    public async Task<IEnumerable<JewelryMaterial>?> GetJewelryMaterials()
    {
        return await _context.JewelryMaterials.ToListAsync();
    }
    public async Task<JewelryMaterial?> GetJewelryMaterialByJewelry(int jewelryId)
    {
        return await _context.JewelryMaterials.FirstOrDefaultAsync(jm => jm.JewelryId == jewelryId);
    }
    public async Task<JewelryMaterial?> GetJewelryMaterialById(int id)
    {
        return await _context.JewelryMaterials.FirstOrDefaultAsync(jm => jm.JewelryMaterialId == id);
    }
    public async Task<int> CreateJewelryMaterial(JewelryMaterial jewelryMaterial)
    {
        await _context.JewelryMaterials.AddAsync(jewelryMaterial);
        return await _context.SaveChangesAsync();
    }
    public async Task<int> DeleteJewelryMaterial(int id)
    {
        var jewelryMaterial = await _context.JewelryMaterials.FirstOrDefaultAsync(jm => jm.JewelryMaterialId == id);
        if (jewelryMaterial == null)
        {
            return 0;
        }
        _context.JewelryMaterials.Remove(jewelryMaterial);
        return await _context.SaveChangesAsync();
    }
}