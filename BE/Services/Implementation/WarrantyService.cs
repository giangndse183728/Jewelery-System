using AutoMapper;
using BusinessObjects.DTO;
using BusinessObjects.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation
{
    public class WarrantyService(IWarrantyRepository warrantyRepository, IMapper mapper) : IWarrantyService
    {
        private IWarrantyRepository WarrantyRepository { get; } = warrantyRepository;
        private IMapper Mapper { get; } = mapper;

        public Task<int> CreateWarranty(WarrantyDto warrantyDto)
        {
            var warranty = Mapper.Map<Warranty>(warrantyDto);
            return WarrantyRepository.Create(warranty);
        }

        public Task<int> DeleteWarranty(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Warranty?>?> GetWarranties()
        {
            return await WarrantyRepository.Gets();
        }

        public async Task<Warranty?> GetWarrantyById(int id)
        {
            return await WarrantyRepository.GetById(id);
        }

        public async Task<int> UpdateWarranty(int id, WarrantyDto warrantyDto)
        {
            var warranty = Mapper.Map<Warranty>(warrantyDto);
            return await WarrantyRepository.Update(id, warranty);
        }
    }
}
