using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation
{
    public class WarrantyRepository(WarrantyDao warrantyDao, JewelryDao jewelryDao) : IWarrantyRepository
    {
        public WarrantyDao WarrantyDao { get; } = warrantyDao;
        public JewelryDao JewelryDao { get; } = jewelryDao;

        public async Task<int> Create(Warranty entity)
        {
            return await WarrantyDao.CreateWarranty(entity);
        }

        public Task<IEnumerable<Warranty>> Find(Func<Warranty, bool> predicate)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Warranty?>?> Gets()
        {
            var warranties = await WarrantyDao.GetWarranties();
            foreach (var warranty in warranties)
            {
                var jewelry = await JewelryDao.GetJewelryById(warranty.JewelryId);
                warranty.Jewelry = jewelry;
            }
            return warranties;
        }

        public async Task<Warranty?> GetById(int id)
        {
            var warranty = await WarrantyDao.GetWarrantyById(id);
            var jewelry = await JewelryDao.GetJewelryById(warranty.JewelryId);
            warranty.Jewelry = jewelry;
            return warranty;
        }

        public async Task<int> Update(int id, Warranty entity)
        {
            return await WarrantyDao.UpdateWarranty(id, entity);
        }
    }
}
