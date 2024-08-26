namespace BusinessObjects.DTO;
public class VnPayResponseModel
{
    public bool Success { get; set; }
    public string PaymentMethod { get; set; }
    public string OrderDescription { get; set; }
    public string OrderId { get; set; }
    public double Amount { get; set; }
    public string PaymentId { get; set; }
    public string TransactionCode { get; set; }
    public string Token { get; set; }
    public string VnPayResponseCode { get; set; }
}

public class VnPayRequestModel
{
    public string OrderType { get; set; }
    public int OrderId { get; set; }
    public float Amount { get; set; }
    public string OrderDescription { get; set; }
    public string Name { get; set; }
    public DateTime CreatedDate { get; set; }
}