using BusinessObjects.Context;
using Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly JssatsContext _context;

        public DashboardController(JssatsContext context)
        {
            _context = context;
        }

        [HttpGet("GetDashboard")]
        public IActionResult GetDashboard()
        {
            var customerCount = _context.Customers.Count();
            var saleCountInMonth = _context.Transactions.Include(x => x.Bill).Where(b => b.Bill.Type == EnumBillType.Sale && b.Bill.CreatedAt.Month == DateTime.Now.Month).Count();
            var purchaseCountInMonth = _context.Bills.Where(b => b.Type == EnumBillType.Purchase && b.CreatedAt.Month == DateTime.Now.Month).Count();
            var totalPurchaseInMonth = _context.Bills.Where(b => b.Type == EnumBillType.Purchase && b.CreatedAt.Month == DateTime.Now.Month).Sum(b => b.TotalAmount);
            var totalSaleInMonth = _context.Transactions.Include(x => x.Bill).Where(b => b.Bill.Type == EnumBillType.Sale && b.Bill.CreatedAt.Month == DateTime.Now.Month).Sum(b => b.Bill.TotalAmount);

            // doanh thu bán hàng theo từng tháng trong năm hiện tại 
            var salesInYearQuery = _context.Transactions.Include(x => x.Bill).Where(b => b.Bill.Type == EnumBillType.Sale && b.Bill.CreatedAt.Year == DateTime.Now.Year);

            // lấy ra doanh thu bán hàng theo từng tháng trong năm hiện tại
            var saleInYear = salesInYearQuery
                .GroupBy(b => b.Bill.CreatedAt.Month)
                .Select(g => new
                {
                    month = g.Key,
                    total = g.Sum(b => b.Bill.TotalAmount)
                })
                .ToList();
            var completeSaleInYear = Enumerable.Range(1, 12)
                .GroupJoin(saleInYear, month => month, sale => sale.month, (month, sales) => new
                {
                    month,
                    total = sales.Sum(s => s.total)
                })
                .ToList();

            // doanh thu mua hàng theo từng tháng trong năm hiện tại
            var purchaseInYear = _context.Bills.Where(b => b.Type == EnumBillType.Purchase && b.CreatedAt.Year == DateTime.Now.Year)
                .GroupBy(b => b.CreatedAt.Month)
                .Select(g => new
                {
                    month = g.Key,
                    total = g.Sum(b => b.TotalAmount)
                })
                .ToList();
            var completePurchaseInYear = Enumerable.Range(1, 12)
                .GroupJoin(purchaseInYear, month => month, purchase => purchase.month, (month, purchases) => new
                {
                    month,
                    total = purchases.Sum(p => p.total)
                })
                .ToList();

            // lấy ra doanh thu bán hàng theo từng quầy trong năm hiện tại
            var salesByCounterInYear = salesInYearQuery
                    .Include(x => x.Bill)
                    .ThenInclude(x => x.Counter)
                .GroupBy(b => new { b.Bill.CounterId, b.Bill.Counter.Name })
                .Select(g => new
                {
                    counterId = g.Key.CounterId,
                    counterName = g.Key.Name,
                    total = g.Sum(b => b.Bill.TotalAmount)
                })
                .ToList();

            var allCounters = _context.Counters.Select(c => new { c.CounterId, c.Name }).ToList();
            var completeSalesByCounterInYear = allCounters
                .GroupJoin(salesByCounterInYear, counter => counter.CounterId, sale => sale.counterId, (counter, sales) => new
                {
                    counterId = counter.CounterId,
                    counterName = counter.Name,
                    total = sales.Sum(s => s.total)
                })
                .ToList();

            return Ok(new
            {
                customerCount,
                saleCountInMonth,
                purchaseCountInMonth,
                totalPurchaseInMonth,
                totalSaleInMonth,
                completeSaleInYear,
                completePurchaseInYear,
                completeSalesByCounterInYear
            });
        }
    }
}
