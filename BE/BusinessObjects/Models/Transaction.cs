namespace BusinessObjects.Models
{
    /// <summary>
    /// Bảng này lưu lại lịch sủ giao dịch của người dùng
    /// </summary>
    public class Transaction
    {
        public int TransactionId { get; set; }
        public string? OrderId { get; set; }
        public int BillId { get; set; }
        public double? Amount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? OrderDescription { get; set; }
        public string? TransactionCode { get; set; }
        public string? Token { get; set; }
        public string? VnPayResponseCode { get; set; }

        public virtual Bill? Bill { get; set; }
    }
}
