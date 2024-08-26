using BusinessObjects.DTO.Jewelry;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using Domain.Constants;

namespace Services.Interface
{
    public interface IJewelryService
    {
        public Task<IEnumerable<JewelryResponseDto?>?> GetJewelries(EnumBillType? type);
        public Task<JewelryResponseDto?> GetJewelryById(int id);
        public Task<int> CreateJewelry(JewelryRequestDto jewelryRequestDto);
        public Task<int> UpdateJewelry(int id, Jewelry jewelry);
        public Task<int> DeleteJewelry(int id);
    }
}
