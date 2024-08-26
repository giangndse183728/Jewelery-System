using BusinessObjects.Context;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly JssatsContext _context;
        private readonly IConfiguration _config;

        public PayController(IVnPayService vnPayService, JssatsContext context, IConfiguration config)
        {
            _vnPayService = vnPayService;
            _context = context;
            _config = config;
        }
        /// <summary>
        /// Nhận thông tin thanh toán từ VNPAY gọi về 
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        [HttpGet("[action]/{billId}")]
        public async Task<IActionResult> PaymentCallBack(int billId)
        {
            try
            {
                var response = await _vnPayService.PaymentExecute(Request.Query, billId);
                if (response.Success)
                {
                    return Redirect(response.Data.ToString());
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
