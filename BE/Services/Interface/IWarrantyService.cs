using BusinessObjects.DTO;
using BusinessObjects.Models;

namespace Services.Interface
{
    public interface IWarrantyService
    {
        public Task<int> CreateWarranty(WarrantyDto warranty);
        public Task<IEnumerable<Warranty?>?> GetWarranties();
        public Task<Warranty?> GetWarrantyById(int id);
        public Task<int> UpdateWarranty(int id, WarrantyDto warranty);
        public Task<int> DeleteWarranty(int id);
    }
}
