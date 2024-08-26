using AutoMapper;
using BusinessObjects.DTO;
using BusinessObjects.Models;
using Domain.Constants;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation
{
    public class PromotionService(IPromotionRepository promotionRepository, IMapper mapper, SessionContext sessionContext) : IPromotionService
    {
        public IPromotionRepository PromotionRepository { get; } = promotionRepository;
        public IMapper Mapper { get; } = mapper;
        public SessionContext SessionContext { get; } = sessionContext;

        public async Task<int> CreatePromotion(PromotionDto promotionDto)
        {
            return await PromotionRepository.Create(Mapper.Map<Promotion>(promotionDto));
        }

        public async Task<int> DeletePromotion(int id)
        {
            return await PromotionRepository.Delete(id);
        }

        public async Task<IEnumerable<PromotionDto?>?> GetPromotions(bool available, int? customerId)
        {
            bool isAdmin = SessionContext.RoleId == (int)AppRole.Admin || SessionContext.RoleId == (int)AppRole.Manager;
            var results = await PromotionRepository.Gets(available, customerId, isAdmin);
            return Mapper.Map<List<PromotionDto>>(results);
        }

        public Task<Promotion?> GetPromotionById(int id)
        {
            return PromotionRepository.GetById(id);
        }

        public async Task<int> UpdatePromotion(int id, PromotionDto promotionDto)
        {
            return await PromotionRepository.Update(id, Mapper.Map<Promotion>(promotionDto));
        }
    }
}
