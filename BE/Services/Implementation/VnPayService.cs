
using BusinessObjects.Context;
using BusinessObjects.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Services.Helpers;
using Services.Interface;

namespace Services.Implementation
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _config;
        private readonly JssatsContext _context;
        public VnPayService(IConfiguration config, JssatsContext context)
        {
            _config = config;
            _context = context;
        }
        public ServiceResponse CreatePaymentUrl(HttpContext context, VnPayRequestModel model)
        {
            ServiceResponse serviceResponse = new ServiceResponse();
            try
            {
                var vnpay = new VnPayLibrary();
                var tick = DateTime.Now.Ticks.ToString();
                var urlCallBack = _config["Vnpay:PaymentCallback"];
                string orderInfo = $"Mã order: {model.OrderId} - Người giao dịch: {model.Name} - Chi tiết giao dịch: {model.OrderDescription} - Tổng tiền: {model.Amount}";

                vnpay.AddRequestData("vnp_Version", _config["VnPay:Version"]);
                vnpay.AddRequestData("vnp_Command", _config["VnPay:Command"]);
                vnpay.AddRequestData("vnp_TmnCode", _config["VnPay:TmnCode"]);
                vnpay.AddRequestData("vnp_Amount", (model.Amount * 100).ToString());

                vnpay.AddRequestData("vnp_CreateDate", model.CreatedDate.ToString("yyyyMMddHHmmss"));
                vnpay.AddRequestData("vnp_CurrCode", _config["VnPay:CurrCode"]);
                vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
                vnpay.AddRequestData("vnp_Locale", _config["VnPay:Locale"]);

                vnpay.AddRequestData("vnp_OrderInfo", orderInfo);
                vnpay.AddRequestData("vnp_OrderType", model.OrderType);
                vnpay.AddRequestData("vnp_ReturnUrl", string.Format(urlCallBack, model.OrderId));
                vnpay.AddRequestData("vnp_TxnRef", tick);

                var paymentUrl = vnpay.CreateRequestUrl(_config["VnPay:BaseUrl"], _config["VnPay:HashSecret"]);
                serviceResponse.Onsuccess(paymentUrl);
            }
            catch (Exception ex)
            {
                serviceResponse.OnError(ex.Message);
            }
            return serviceResponse;
        }
        public async Task<ServiceResponse> PaymentExecute(IQueryCollection collection, int billId)
        {
            ServiceResponse serviceResponse = new ServiceResponse();
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_OrderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collection.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");
            var vnp_Amount = float.Parse(vnpay.GetResponseData("vnp_Amount"));

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _config["VnPay:HashSecret"]);

            if (!checkSignature)
            {
                return serviceResponse.OnError("Invalid signature");
            }

            var res = new VnPayResponseModel
            {
                Success = true,
                Amount = vnp_Amount,
                PaymentMethod = "VnPay",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_OrderId.ToString(),
                TransactionCode = vnp_TransactionId.ToString(),
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode,
            };

            var transaction = new BusinessObjects.Models.Transaction
            {
                OrderId = res.OrderId,
                Amount = res.Amount,
                PaymentMethod = res.PaymentMethod,
                BillId = billId,
                TransactionCode = res.TransactionCode,
                OrderDescription = res.OrderDescription,
                VnPayResponseCode = res.VnPayResponseCode,
                Token = res.Token,
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return serviceResponse.Onsuccess(_config["VnPay:FEPaymentCallbackSuccess"]);
        }
    }
}
