using AutoMapper;
using BusinessObjects.Context;
using BusinessObjects.DTO.Jewelry;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using DAO;
using Domain.Constants;
using Repositories.Interface;

namespace Repositories.Implementation
{
    public class JewelryRepository(
        JewelryDao jewelryDao,
        JewelryTypeDao jewelryTypeDao,
        GoldPriceDao goldPriceDao,
        GemPriceDao gemPriceDao,
        JewelryMaterialDao jewelryMaterialDao,
        JssatsContext jssatsContext,
        IMapper mapper) : IJewelryRepository
    {
        public JewelryDao JewelryDao { get; } = jewelryDao;
        public JewelryTypeDao JewelryTypeDao { get; } = jewelryTypeDao;
        public GoldPriceDao GoldPriceDao { get; } = goldPriceDao;
        public GemPriceDao GemPriceDao { get; } = gemPriceDao;
        public JewelryMaterialDao JewelryMaterialDao { get; } = jewelryMaterialDao;
        public JssatsContext JssatsContext { get; } = jssatsContext;
        public IMapper Mapper { get; } = mapper;

        public async Task<int> Create(Jewelry entity)
        {
            entity.IsSold = false;
            return await JewelryDao.CreateJewelry(entity);
        }

        public async Task<int> Delete(int id)
        {
            return await JewelryDao.DeleteJewelry(id);
        }

        public async Task<IEnumerable<JewelryResponseDto>?> Gets()
        {
            var jewelries = await JewelryDao.GetJewelriesDetails(null);
            if (jewelries == null || !jewelries.Any())
            {
                return null;
            }

            var jewelryResponseDtos = new List<JewelryResponseDto>();


            foreach (var jewelry in jewelries)
            {
                var totalPrice = jewelry.JewelryMaterials.Sum(jm => CalculateTotalPrice(jm, jewelry.LaborCost));
                var jewelryCounters = Mapper.Map<List<JewelryCounterDTO>>(jewelry.JewelryCounters ?? []);
                var jewelryResponseDto = new JewelryResponseDto
                {
                    JewelryId = jewelry.JewelryId,
                    Code = jewelry.Code,
                    Name = jewelry.Name,
                    JewelryType = jewelry.JewelryType?.Name,
                    JewelryTypeId = jewelry.JewelryType?.JewelryTypeId,
                    Barcode = jewelry.Barcode,
                    LaborCost = jewelry.LaborCost,
                    PreviewImage = jewelry.PreviewImage,
                    JewelryPrice = CalculateJewelryPrice(jewelry.JewelryMaterials.FirstOrDefault()),
                    WarrantyTime = jewelry.WarrantyTime,
                    Materials = jewelry.JewelryMaterials.Select(jm => new Materials
                    {
                        Gold = new GoldResponseDto
                        {
                            GoldId = jm.GoldId,
                            GoldType = jm.Gold?.Type,
                            GoldPrice = jm.Gold?.SellPrice ?? 0,
                            GoldWeight = jm.GoldWeight
                        },
                        Gem = new GemResponseDto
                        {
                            GemId = jm.GemId,
                            GemType = jm.Gem?.Type,
                            GemQuantity = jm.StoneQuantity,
                            GemPrice = jm.Gem?.SellPrice ?? 0,
                        },
                        JewelryMaterialId = jm.JewelryMaterialId
                    }).ToList(),
                    TotalPrice = totalPrice,
                    JewelryCounters = jewelryCounters,
                    Type = jewelry.Type
                };

                jewelryResponseDtos.Add(jewelryResponseDto);
            }

            return jewelryResponseDtos;
        }

        public async Task<JewelryResponseDto> GetById(int id)
        {
            var jewelry = await JewelryDao.GetJewelryById(id);
            var jewelryType = await JewelryTypeDao.GetJewelryTypeById(jewelry.JewelryTypeId);
            var jewelryMaterial = await JewelryMaterialDao.GetJewelryMaterialByJewelry(id);
            var goldType = await GoldPriceDao.GetGoldPriceById(jewelryMaterial.GoldId);
            var stoneType = await GemPriceDao.GetStonePriceById(jewelryMaterial.GemId);

            jewelryMaterial.Gold = goldType;
            jewelryMaterial.Gem = stoneType;
            jewelry.JewelryType = jewelryType;
            jewelry.JewelryMaterials = new List<JewelryMaterial> { jewelryMaterial };

            var totalPrice = CalculateTotalPrice(jewelryMaterial, jewelry.LaborCost);

            var jewelryResponseDto = new JewelryResponseDto
            {
                JewelryId = jewelry.JewelryId,
                Name = jewelry.Name,
                JewelryType = jewelryType.Name,
                Barcode = jewelry.Barcode,
                JewelryPrice = CalculateJewelryPrice(jewelryMaterial),
                LaborCost = jewelry.LaborCost,
                WarrantyTime = jewelry.WarrantyTime,
                Materials = jewelry.JewelryMaterials.Select(jm => new Materials
                {
                    Gold = new GoldResponseDto
                    {
                        GoldType = jm.Gold?.Type,
                        GoldWeight = jm?.GoldWeight,
                        GoldPrice = jm?.Gold?.SellPrice ?? 0
                    },
                    Gem = new GemResponseDto
                    {
                        GemType = jm?.Gem?.Type,
                        GemQuantity = jm?.StoneQuantity,
                        GemPrice = jm?.Gem?.SellPrice ?? 0
                    },
                    JewelryMaterialId = jm.JewelryMaterialId
                }).ToList(),
                TotalPrice = totalPrice
            };

            return jewelryResponseDto;
        }

        public async Task<int> Update(int id, Jewelry entity)
        {
            return await JewelryDao.UpdateJewelry(id, entity);
        }

        private static decimal CalculateTotalPrice(JewelryMaterial jewelryMaterial, decimal? laborCost)
        {
            decimal totalPrice = 0;
            if (jewelryMaterial.Gold != null)
            {
                totalPrice += jewelryMaterial.Gold.BuyPrice * jewelryMaterial.GoldWeight ?? 0;
            }

            if (jewelryMaterial.Gem != null)
            {
                totalPrice += jewelryMaterial.Gem.BuyPrice * jewelryMaterial.StoneQuantity ?? 0;
            }

            totalPrice += (decimal)(laborCost ?? 0);
            return totalPrice;
        }

        private static decimal CalculateJewelryPrice(JewelryMaterial? jewelryMaterial)
        {
            decimal totalPrice = 0;
            if (jewelryMaterial == null) return totalPrice;

            if (jewelryMaterial.Gold != null)
            {
                totalPrice += jewelryMaterial.Gold.BuyPrice * jewelryMaterial.GoldWeight ?? 0;
            }

            if (jewelryMaterial.Gem != null)
            {
                totalPrice += jewelryMaterial.Gem.BuyPrice * jewelryMaterial.StoneQuantity ?? 0;
            }

            return totalPrice;
        }

        public async Task<IEnumerable<JewelryResponseDto>?> Gets(EnumBillType? type)
        {
            var jewelries = await JewelryDao.GetJewelriesDetails(type);
            if (jewelries == null || !jewelries.Any())
            {
                return null;
            }

            var jewelryResponseDtos = new List<JewelryResponseDto>();


            foreach (var jewelry in jewelries)
            {
                var totalPrice = jewelry.JewelryMaterials.Sum(jm => CalculateTotalPrice(jm, jewelry.LaborCost));
                var jewelryCounters = Mapper.Map<List<JewelryCounterDTO>>(jewelry.JewelryCounters ?? []);
                var jewelryResponseDto = new JewelryResponseDto
                {
                    JewelryId = jewelry.JewelryId,
                    Code = jewelry.Code,
                    Name = jewelry.Name,
                    JewelryType = jewelry.JewelryType?.Name,
                    JewelryTypeId = jewelry.JewelryType?.JewelryTypeId,
                    Barcode = jewelry.Barcode,
                    LaborCost = jewelry.LaborCost,
                    PreviewImage = jewelry.PreviewImage,
                    JewelryPrice = CalculateJewelryPrice(jewelry.JewelryMaterials.FirstOrDefault()),
                    WarrantyTime = jewelry.WarrantyTime,
                    Materials = jewelry.JewelryMaterials.Select(jm => new Materials
                    {
                        Gold = new GoldResponseDto
                        {
                            GoldId = jm.GoldId,
                            GoldType = jm.Gold?.Type,
                            GoldPrice = jm.Gold?.SellPrice ?? 0,
                            GoldWeight = jm.GoldWeight
                        },
                        Gem = new GemResponseDto
                        {
                            GemId = jm.GemId,
                            GemType = jm.Gem?.Type,
                            GemQuantity = jm.StoneQuantity,
                            GemPrice = jm.Gem?.SellPrice ?? 0,
                        },
                        JewelryMaterialId = jm.JewelryMaterialId
                    }).ToList(),
                    TotalPrice = totalPrice,
                    JewelryCounters = jewelryCounters,
                    Type = jewelry.Type
                };

                jewelryResponseDtos.Add(jewelryResponseDto);
            }

            return jewelryResponseDtos;
        }
    }
}