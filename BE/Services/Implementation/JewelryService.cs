using AutoMapper;
using BusinessObjects.Context;
using BusinessObjects.DTO;
using BusinessObjects.DTO.Jewelry;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using BusinessObjects.Utils;
using Domain.Constants;
using Repositories.Interface;
using Services.Interface;
using Tools;

namespace Services.Implementation
{
    public class JewelryService(
        IJewelryRepository jewelryRepository,
        IJewelryMaterialRepository jewelryMaterialRepository,
        JssatsContext context,
        SessionContext sessionContext,
        IMapper mapper) : IJewelryService
    {
        private IJewelryRepository JewelryRepository { get; } = jewelryRepository;
        public IJewelryMaterialRepository JewelryMaterialRepository { get; } = jewelryMaterialRepository;
        private JssatsContext Context { get; } = context;
        private SessionContext SessionContext { get; } = sessionContext;
        private IMapper Mapper { get; } = mapper;

        public async Task<IEnumerable<JewelryResponseDto?>?> GetJewelries(EnumBillType? type)
        {
            var jewelries = await JewelryRepository.Gets(type);
            return jewelries;
        }

        public async Task<JewelryResponseDto?> GetJewelryById(int id)
        {
            var jewelryResponseDto = await JewelryRepository.GetById(id);
            return jewelryResponseDto;
        }

        public async Task<int> CreateJewelry(JewelryRequestDto jewelryRequestDto)
        {
            try
            {
                if (SessionContext.CounterId == null && SessionContext.RoleId == (int)AppRole.Staff)
                {
                    throw new CustomException.InvalidDataException("CounterId is required.");
                }

                // Create Jewelry first before creating JewelryMaterial
                var jewelry = Mapper.Map<Jewelry>(jewelryRequestDto);
                jewelry.CreatedAt = DateTime.Now;
                jewelry.UpdatedAt = DateTime.Now;
                jewelry.IsSold = false;
                jewelry.JewelryMaterials =
                    [
                        new JewelryMaterial
                        {
                            GoldId = jewelryRequestDto?.JewelryMaterial?.GoldId,
                            GemId = jewelryRequestDto?.JewelryMaterial?.GemId,
                            GoldWeight = jewelryRequestDto?.JewelryMaterial?.GoldWeight,
                            StoneQuantity = jewelryRequestDto?.JewelryMaterial?.GemQuantity
                        }
                    ];

                if (SessionContext.RoleId == (int)AppRole.Staff)
                {
                    jewelry.JewelryCounters =
                    [
                        new JewelryCounter
                        {
                            CounterId = SessionContext.CounterId.Value,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now
                        }
                    ];

                    // nhân viên bán hàng thì chỉ có thể thêm sản phẩm với loại là trang sức mua lại
                    jewelry.Type = EnumBillType.Purchase;
                }
                else
                {
                    // ngầm định khi thêm mới sản phẩm sẽ trang sức bán
                    jewelry.Type = EnumBillType.Sale;
                    if (jewelry.JewelryCounters.Count == 0)
                    {
                        var jewelryCounters = new List<JewelryCounter>();
                        var counters = Context.Counters;
                        if (counters.Any())
                        {
                            jewelry.JewelryCounters = [.. counters.Select(x => new JewelryCounter
                            {
                                CounterId = x.CounterId,
                                CreatedAt = DateTime.Now,
                                UpdatedAt = DateTime.Now
                            })];
                        }
                    }
                    else
                    {
                        jewelry.JewelryCounters = jewelry.JewelryCounters.Select(x => new JewelryCounter
                        {
                            CounterId = x.CounterId,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now
                        }).ToList();
                    }
                }

                await Context.Database.BeginTransactionAsync();
                await Context.Jewelries.AddAsync(jewelry);
                await Context.SaveChangesAsync();

                FileUtil.SaveTempToReal(jewelry.PreviewImage, EnumFileType.Jewellery);

                await Context.Database.CommitTransactionAsync();
            }
            catch (Exception)
            {
                await Context.Database.RollbackTransactionAsync();
                throw new CustomException.InvalidDataException("Failed to create Jewelry.");
            }

            return 1;
        }

        public async Task<int> DeleteJewelry(int id)
        {
            return await JewelryRepository.Delete(id);
        }

        public async Task<int> UpdateJewelry(int id, Jewelry jewelry)
        {
            return await JewelryRepository.Update(id, jewelry);
        }
    }
}