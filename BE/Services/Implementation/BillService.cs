using AutoMapper;
using BusinessObjects.Context;
using BusinessObjects.DTO;
using BusinessObjects.DTO.Bill;
using BusinessObjects.DTO.BillReqRes;
using BusinessObjects.Models;
using Domain.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Repositories.Implementation;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation
{
    public class BillService(
        IMapper mapper,
        IBillRepository billRepository,
        IBillPromotionRepository billPromotionRepository,
        IBillJewelryRepository billJewelryRepository,
        IPromotionRepository promotionRepository,
        IBillDetailRepository billDetailRepository,
        ICustomerRepository customerRepository,
        IUserRepository userRepository,
        IJewelryRepository jewelryRepository,
        JssatsContext _context,
        IVnPayService vnPayService,
        IHttpContextAccessor httpContext) : IBillService
    {

        public JssatsContext Context { get; } = _context;
        public IMapper Mapper { get; } = mapper;
        private IBillRepository BillRepository { get; } = billRepository;
        public IBillPromotionRepository BillPromotionRepository { get; } = billPromotionRepository;
        public IBillJewelryRepository BillJewelryRepository { get; } = billJewelryRepository;
        public IPromotionRepository PromotionRepository { get; } = promotionRepository;
        public IBillDetailRepository BillDetailRepository { get; } = billDetailRepository;
        public ICustomerRepository CustomerRepository { get; } = customerRepository;
        public IUserRepository UserRepository { get; } = userRepository;
        public IJewelryRepository JewelryRepository { get; } = jewelryRepository;
        public IVnPayService VnPayService { get; } = vnPayService;
        public IHttpContextAccessor HttpContext { get; } = httpContext;

        public async Task<ServiceResponse> Create(BillRequestDto billRequestDto)
        {
            ServiceResponse serviceResponse = new();
            decimal totalDiscountRate = 0;

            var customer = await Context.Customers.FirstOrDefaultAsync(c => c.CustomerId == billRequestDto.CustomerId) ?? throw new Exception("Customer not found");

            // Create bill
            var bill = new Bill
            {
                CustomerId = billRequestDto.CustomerId,
                UserId = billRequestDto.UserId,
                CounterId = billRequestDto.CounterId,
                SaleDate = DateTime.Now.ToUniversalTime(),
                CreatedAt = DateTime.Now.ToUniversalTime(),
                UpdatedAt = DateTime.Now.ToUniversalTime(),
                TotalAmount = 0,
                DiscountRate = 0,
                DiscountDescription = null,
                Type = billRequestDto.Type
            };

            // lấy ra danh sách các sản phẩm có trong database từ billRequestDto
            var jewelries = await Context.Jewelries
                        .Where(j => billRequestDto.Jewelries.Select(j => j.JewelryId).Contains(j.JewelryId))
                        .Include(j => j.JewelryType)
                        .Include(j => j.JewelryMaterials)
                            .ThenInclude(jm => jm.Gem)
                        .Include(j => j.JewelryMaterials)
                            .ThenInclude(jm => jm.Gold)
                        .ToListAsync();

            // lấy ra danh sách các khuyến mãi có trong database từ billRequestDto
            var promotions = new List<Promotion>();
            if (billRequestDto.Type == EnumBillType.Sale)
            {
                if (billRequestDto.Promotions != null && billRequestDto.Promotions.Count() > 0)
                {
                    promotions = Context.Promotions
                        .Where(p => billRequestDto.Promotions.Select(p => p.PromotionId).Contains(p.PromotionId)).ToList();

                }

                // kiểm tra xem danh sách sản phẩm và khuyến mãi có tồn tại trong database không
                if (jewelries.Count != billRequestDto.Jewelries.Count() || promotions.Count != billRequestDto.Promotions.Count())
                {
                    throw new Exception("Some items are not found in database");
                }
            }

            // Build billJewelries
            int sortOrder = 0;
            foreach (var item in jewelries)
            {
                var jewelry = billRequestDto.Jewelries.First(j => j.JewelryId == item.JewelryId);
                var quantity = jewelry.Quantity;
                var material = item.JewelryMaterials.FirstOrDefault();

                var stoneQuantity = material?.StoneQuantity;
                var goldWeiht = material?.GoldWeight;

                if (billRequestDto.Type == EnumBillType.Purchase)
                {
                    if (jewelry.GoldSellPrice != null && material?.Gold != null)
                    {
                        material.GoldWeight = jewelry.GoldWeight;
                        material.Gold.SellPrice = jewelry.GoldSellPrice.Value;
                    }
                    if (jewelry.GemSellPrice != null && material?.Gem != null)
                    {
                        material.StoneQuantity = jewelry.GemQuantity;
                        material.Gem.SellPrice = jewelry.GemSellPrice.Value;
                    }
                }

                var billJewelry = new BillJewelry
                {
                    JewelryId = item.JewelryId,
                    Quantity = quantity,

                    GemSellPrice = material?.Gem?.SellPrice ?? 0, // giá bán đá
                    GemType = material?.Gem?.Type, // loại đá
                    StoneQuantity = material.StoneQuantity ?? 0, // số lượng đá

                    GoldSellPrice = material?.Gold?.SellPrice ?? 0, // giá bán vàng
                    GoldWeight = material?.GoldWeight ?? 0, // trọng lượng vàng
                    GoldType = material?.Gold?.Type, // loại vàng

                    CreatedAt = DateTime.Now.ToUniversalTime(),
                    UpdatedAt = DateTime.Now.ToUniversalTime(),
                    TotalAmount = 0,
                    LaborCost = item.LaborCost ?? 0,

                    SortOrder = sortOrder++
                };
                // Nếu là bán trang sức: totalPrice = [giá vàng thời điểm * trọng lượng sản phẩm] + tiền công + tiền đá
                if (billRequestDto.Type == EnumBillType.Sale)
                {
                    billJewelry.TotalAmount = (billJewelry.GoldSellPrice * billJewelry.GoldWeight) + billJewelry.LaborCost + (billJewelry.GemSellPrice * billJewelry.StoneQuantity);
                }
                else
                {
                    // Nếu là mua trang sức: totalPrice = [giá vàng thời điểm * trọng lượng sản phẩm thực tế] + 70% (tiền đá * số lượng đá thực tế)
                    billJewelry.TotalAmount = (billJewelry.GoldSellPrice * billJewelry.GoldWeight) + (billJewelry.GemSellPrice * billJewelry.StoneQuantity) * 0.7m;
                }

                billJewelry.TotalAmount *= quantity; // nếu có nhiều sản phẩm cùng loại
                bill.TotalAmount += billJewelry.TotalAmount; // tổng tiền của bill
                bill.BillJewelries.Add(billJewelry);
            }

            if (promotions.Count > 0)
            {
                // nếu có promotion thì nhân với discount rate
                foreach (var promotion in promotions)
                {
                    totalDiscountRate += promotion.DiscountRate ?? 0;
                    bill.TotalAmount *= (1 - promotion.DiscountRate / 100);
                }

                bill.DiscountRate = (decimal)totalDiscountRate;
                bill.DiscountDescription = promotions[0].Description;
            }

            var transaction = Context.Database.BeginTransaction();
            try
            {
                customer.Point += 100;
                Context.Customers.Update(customer);
                await Context.SaveChangesAsync();

                bill.TotalAmount = Math.Round(bill.TotalAmount ?? 0, 2);
                var newBill = await Context.Bills.AddAsync(bill);
                await Context.SaveChangesAsync();

                if (billRequestDto.Type == EnumBillType.Sale)
                {
                    if (promotions.Count > 0)
                    {
                        // Build BillPromotions
                        var billPromotions = new List<BillPromotion>();
                        foreach (var promotion in promotions)
                        {
                            var billPromotion = new BillPromotion
                            {
                                BillId = newBill.Entity.BillId,
                                PromotionId = promotion.PromotionId
                            };
                            billPromotions.Add(billPromotion);
                        }
                        await Context.BillPromotions.AddRangeAsync(billPromotions);
                        await Context.SaveChangesAsync();
                    }

                    // Build Warranty
                    var warranties = new List<Warranty>();
                    foreach (var item in jewelries)
                    {
                        var warrantyMonth = item.WarrantyTime;
                        var quantity = billRequestDto.Jewelries.First(j => j.JewelryId == item.JewelryId).Quantity;
                        if (warrantyMonth != null)
                        {
                            for (int i = 0; i < quantity; i++)
                            {
                                var warranty = new Warranty
                                {
                                    BillId = newBill.Entity.BillId,
                                    CustomerId = billRequestDto.CustomerId,
                                    EndDate = DateTime.Now.AddMonths(warrantyMonth.Value).ToUniversalTime(),
                                    JewelryId = item.JewelryId
                                };
                                warranties.Add(warranty);
                            }
                        }
                    }

                    if (warranties.Count > 0)
                    {
                        await Context.Warranties.AddRangeAsync(warranties);
                        await Context.SaveChangesAsync();
                    }

                    if (bill.TotalAmount < 5000 || bill.TotalAmount > 1000000000)
                    {
                        throw new Exception("Total amount must be greater than 5000 and less than 1 billion");
                    }

                    serviceResponse = VnPayService.CreatePaymentUrl(HttpContext.HttpContext, new VnPayRequestModel
                    {
                        Amount = (float)bill.TotalAmount.Value,
                        CreatedDate = DateTime.Now,
                        Name = customer.FullName ?? "",
                        OrderId = bill.BillId,
                        OrderType = "order",
                        OrderDescription = "Thanh toán hóa đơn mua trang sức"
                    });

                    if (!serviceResponse.Success)
                    {
                        throw new Exception("Create payment url failed");
                    }

                    var paymentUrl = serviceResponse.Data.ToString();
                    HttpClient client = new();
                    var response = await client.GetAsync(paymentUrl);
                    var responseString = await response.Content.ReadAsStringAsync();
                    if (responseString.Contains("Dữ liệu gửi sang không đúng định dạng"))
                    {
                        throw new Exception("Dữ liệu gửi sang không đúng định dạng");
                    }
                }

                transaction.Commit();
            }
            catch (System.Exception)
            {
                transaction.Rollback();
                throw;
            }

            return serviceResponse;
        }

        /// <summary>
        /// Get all bills
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<BillDetailDto?>?> GetBills(int type)
        {
            var bills = Context.Bills
                        .Include(user => user.User)
                        .Include(customer => customer.Customer)
                        .Include(counter => counter.Counter)
                        .Include(transaction => transaction.Transactions)
                        .Where(billType => billType.Type == (EnumBillType)type)
                        .ToList();

            return new List<BillDetailDto?>(bills.Select(bill => new BillDetailDto
            {
                Id = bill.BillId,
                BillId = bill.BillId,
                CustomerName = bill?.Customer?.FullName,
                CounterId = bill.CounterId,
                CounterName = bill?.Counter?.Name,
                CustomerId = bill.CustomerId,
                StaffName = bill?.User?.FullName,
                UserId = bill.UserId,
                TotalAmount = Math.Round(bill.TotalAmount ?? 0, 2),
                SaleDate = bill.SaleDate,
                DiscountRate = bill.DiscountRate,
                DiscountDescription = bill.DiscountDescription,
                PaymentStatus = bills.FirstOrDefault(b => b.BillId == bill.BillId)?.Transactions.FirstOrDefault() != null
            }));
        }

        public async Task<BillDetailDto?> GetById(int id)
        {
            var bill = await Context.Bills
                        .Include(user => user.User) // lấy thông tin nhân viên
                        .Include(customer => customer.Customer) // lấy thông tin khách hàng
                        .Include(counter => counter.Counter) // lấy thông tin quầy
                        .Include(Warranty => Warranty.Warranties) // lấy thông tin bảo hành
                        .Include(billJewelry => billJewelry.BillJewelries) // lấy thông tin sản phẩm
                            .ThenInclude(j => j.Jewelry)
                        .Include(billPromotion => billPromotion.BillPromotions) // lấy thông tin khuyến mãi
                            .ThenInclude(p => p.Promotion)
                        .Include(warranty => warranty.Warranties)
                        .FirstOrDefaultAsync(bill => bill.BillId == id);

            if (bill == null)
            {
                return null;
            }

            var billDetailDto = new BillDetailDto
            {
                Id = bill.BillId,
                BillId = bill.BillId,
                CustomerName = bill?.Customer?.FullName,
                CustomerId = bill.CustomerId,
                CustomerAddress = bill.Customer.Address,
                CustomerPhone = bill.Customer.Phone,
                CustomerCode = bill.Customer.Code,
                StaffName = bill?.User?.FullName,
                StaffCode = bill?.User?.Code,
                UserId = bill.UserId,
                CounterId = bill.CounterId,
                CounterName = bill?.Counter?.Name,
                TotalAmount = bill?.TotalAmount,
                SaleDate = bill?.SaleDate,
                DiscountRate = bill?.DiscountRate,
                DiscountDescription = bill?.DiscountDescription
            };

            foreach (var item in bill?.BillJewelries)
            {
                item.Code = item.Jewelry?.Code;
                item.Name = item.Jewelry?.Name;
                item.Warranty = bill.Warranties.FirstOrDefault(w => w.BillId == item.BillId && w.JewelryId == item.JewelryId)?.EndDate;
                item.Jewelry = null;
                item.Bill = null;
                billDetailDto.Items.Add(item);
            }

            foreach (var item in bill.BillPromotions)
            {
                var promotion = Mapper.Map<BillPromotionCustomDTO>(item);
                promotion.Description = item.Promotion?.Description;
                promotion.DiscountRate = item.Promotion?.DiscountRate;
                promotion.Bill = null;
                promotion.Promotion = null;
                billDetailDto.Promotions.Add(promotion);
            }

            billDetailDto.Items = billDetailDto.Items.OrderBy(i => i.SortOrder).ToList();

            foreach (var item in bill.Warranties)
            {
                item.Jewelry = null;
                item.Customer = null;
                item.Bill = null;
                billDetailDto.Warranties.Add(item);
            }

            return billDetailDto;
        }

        public async Task<ServiceResponse> PayNow(int billId)
        {
            var serviceResponse = new ServiceResponse();
            var bill = await Context.Bills.FirstOrDefaultAsync(x => x.BillId == billId);
            if (bill == null)
            {
                return serviceResponse.OnError("Bill not found");
            }

            var customer = await Context.Customers.FirstOrDefaultAsync(c => c.CustomerId == bill.CustomerId);
            if (customer == null)
            {
                return serviceResponse.OnError("Customer not found");
            }

            if (bill.TotalAmount < 5000 || bill.TotalAmount > 1000000000)
            {
                return serviceResponse.OnError("Total amount must be greater than 5000 and less than 1 billion");
            }

            serviceResponse = VnPayService.CreatePaymentUrl(HttpContext.HttpContext, new VnPayRequestModel
            {
                Amount = (float)bill.TotalAmount.Value,
                CreatedDate = DateTime.Now,
                Name = customer.FullName ?? "",
                OrderId = bill.BillId,
                OrderType = "order",
                OrderDescription = "Thanh toán hóa đơn mua trang sức"
            });

            if (!serviceResponse.Success)
            {
                return serviceResponse.OnError("Create payment url failed");
            }

            var paymentUrl = serviceResponse.Data.ToString();
            HttpClient client = new();
            var response = await client.GetAsync(paymentUrl);
            var responseString = await response.Content.ReadAsStringAsync();
            if (responseString.Contains("Dữ liệu gửi sang không đúng định dạng"))
            {
                return serviceResponse.OnError("Dữ liệu gửi sang không đúng định dạng");
            }

            return serviceResponse;
        }
    }
}