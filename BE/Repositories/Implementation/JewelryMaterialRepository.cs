using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class JewelryMaterialRepository(JewelryMaterialDao jewelryMaterialDao) : IJewelryMaterialRepository
{
    private JewelryMaterialDao JewelryMaterialDao { get; } = jewelryMaterialDao;

    public async Task<IEnumerable<JewelryMaterial>?> Gets()
    {
        return await JewelryMaterialDao.GetJewelryMaterials();
    }

    public async Task<JewelryMaterial?> GetById(int id)
    {
        return await JewelryMaterialDao.GetJewelryMaterialById(id);
    }

    public async Task<int> Create(JewelryMaterial entity)
    {
        return await JewelryMaterialDao.CreateJewelryMaterial(entity);
    }

    public async Task<int> Delete(int id)
    {
        return await JewelryMaterialDao.DeleteJewelryMaterial(id);
    }
}