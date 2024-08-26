using BusinessObjects.DTO.Bill;

namespace BusinessObjects.DTO.BillReqRes
{
    public class BillResponseDto
    {
        public int BillId { get; set; }
        public string? CustomerName { get; set; }
        public string? StaffName { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalDiscount { get; set; }
        public DateTimeOffset? SaleDate { get; set; }
        public required List<BillItemResponse?> Items { get; set; }
        public required List<BillPromotionResponse?> Promotions { get; set; }
        public decimal AdditionalDiscount { get; set; }
        public int PointsUsed { get; set; }
        public decimal FinalAmount { get; set; }
    }
}