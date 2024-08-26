using AutoMapper;
using BusinessObjects.DTO;
using BusinessObjects.DTO.BillReqRes;
using BusinessObjects.DTO.Counter;
using BusinessObjects.DTO.Jewelry;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;

namespace API.Extensions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // RequestDto Mapping
            CreateMap<Jewelry, JewelryRequestDto>().ReverseMap();
            // Dto Mapping
            CreateMap<Warranty, WarrantyDto>().ReverseMap();
            CreateMap<JewelryType, JewelryTypeDto>().ReverseMap();
            CreateMap<JewelryCounter, JewelryCounterDTO>().ReverseMap();
            CreateMap<JewelryCounter, JewelryCounterDTO>()
                .ForMember(x => x.CounterName, x => x.MapFrom(x => x.Counter.Name));

            CreateMap<CustomerPromotion, CustomerPromotionDTO>().ReverseMap();
            CreateMap<CustomerPromotion, CustomerPromotionDTO>()
               .ForMember(x => x.FullName, x => x.MapFrom(x => x.Customer.FullName));


            CreateMap<Promotion, PromotionDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserCounter>().ReverseMap();
            CreateMap<User, UserDto>().
                ForMember(dest => dest.CounterName, opt => opt.MapFrom(src => src.Counter.Name));

            CreateMap<Customer, CustomerDto>().ReverseMap();
            // ResponseDto Mapping
            CreateMap<Gold, GoldPriceResponseDto>().ReverseMap();
            CreateMap<Gem, GemPriceResponseDto>().ReverseMap();
            CreateMap<Customer, CustomerResponseDto>();
            // MongoDB Mapping
            CreateMap<BillResponseDto, BillDetailDto>().ReverseMap();
            CreateMap<CounterDTO, Counter>().ReverseMap()
                .ForMember(dest => dest.NumOfStaff, opt => opt.MapFrom(src => src.Users.Count));

            CreateMap<BillPromotion, BillPromotionCustomDTO>();
        }
    }
}
