using BusinessObjects.DTO.Bill;
using BusinessObjects.DTO.BillReqRes;
using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation
{
    public class BillRepository(BillDao billDao, BillJewelryDao billJewelryDao, BillPromotionDao billPromotionDao) : IBillRepository
    {
        public BillDao BillDao { get; } = billDao;
        public BillJewelryDao BillJewelryDao { get; } = billJewelryDao;
        public BillPromotionDao BillPromotionDao { get; } = billPromotionDao;

        public async Task<IEnumerable<Bill?>?> Gets()
        {
            return await BillDao.GetBills();
        }

        public async Task<Bill?> GetById(int id)
        {
            return await BillDao.GetBillById(id);
        }

        public async Task<BillResponseDto> CreateBill(BillRequestDto billRequestDto)
        {
            decimal totalAmount = 999;
            decimal totalDiscount = 0;
            decimal finalAmount = 0;

            // Create bill
            var bill = new Bill
            {
                CustomerId = billRequestDto.CustomerId,
                UserId = billRequestDto.UserId,
                SaleDate = DateTime.Now.ToUniversalTime(),
                TotalAmount = totalAmount,
            };
            var billId = await BillDao.CreateBill(bill);
            // Check if bill is created
            if (billId == null)
            {
                throw new InvalidOperationException("Failed to create the bill.");
            }
            // Add bill items
            foreach (var item in billRequestDto.Jewelries)
            {
                var billJewelry = new BillJewelry
                {
                    BillId = billId,
                    JewelryId = item.JewelryId,
                };
                await BillJewelryDao.CreateBillJewelry(billJewelry);
            }
            // Add bill promotions
            foreach (var promotion in billRequestDto.Promotions)
            {
                var billPromotion = new BillPromotion
                {
                    BillId = billId,
                    PromotionId = promotion.PromotionId,
                };
                await BillPromotionDao.CreateBillPromotion(billPromotion);
            }
            // Generate response
            var billResponseDto = new BillResponseDto
            {
                BillId = billId,
                TotalAmount = totalAmount,
                SaleDate = bill.SaleDate,
                Items = billRequestDto.Jewelries.Select(i => new BillItemResponse
                {
                    JewelryId = i.JewelryId,
                    TotalPrice = 0 // Calculate price
                }).ToList(),
                Promotions = billRequestDto.Promotions.Select(p => new BillPromotionResponse
                {
                    PromotionId = p.PromotionId,
                    Discount = 0 // Calculate discount
                }).ToList(),
                PointsUsed = 0, // Calculate points used
                FinalAmount = 0 // Calculate final amount
            };
            return billResponseDto;
        }
        public Task<int> Create(Bill entity)
        {
            throw new NotImplementedException();
        }
        public async Task<int> CreateBill(Bill entity)
        {
            return await BillDao.CreateBill(entity);
        }

        public async Task<int> UpdateBill(Bill entity)
        {
            return await BillDao.UpdateBill(entity);
        }
    }
}
