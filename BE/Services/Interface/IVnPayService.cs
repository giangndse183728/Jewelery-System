using BusinessObjects.DTO;
using Microsoft.AspNetCore.Http;

namespace Services.Interface
{
    public interface IVnPayService
    {
        ServiceResponse CreatePaymentUrl(HttpContext context, VnPayRequestModel model);
        Task<ServiceResponse> PaymentExecute(IQueryCollection collection, int billId);
    }
}
