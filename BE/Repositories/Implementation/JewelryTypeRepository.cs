using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation;

public class JewelryTypeRepository(JewelryTypeDao jewelryTypeDao) : IJewelryTypeRepository
{
    public JewelryTypeDao JewelryTypeDao { get; } = jewelryTypeDao;

    public async Task<IEnumerable<JewelryType?>?> Gets()
    {
        return await JewelryTypeDao.GetJewelryTypes();
    }

    public async Task<JewelryType?> GetById(int id)
    {
        return await JewelryTypeDao.GetJewelryTypeById(id);
    }

    public async Task<int> Create(JewelryType entity)
    {
        return await JewelryTypeDao.CreateJewelryType(entity);
    }

    public async Task<int> Update(int id, JewelryType entity)
    {
        return await JewelryTypeDao.UpdateJewelryType(id, entity);
    }
}