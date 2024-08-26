using BusinessObjects.DTO;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController(IPromotionService promotionService) : ControllerBase
    {
        private IPromotionService PromotionService { get; } = promotionService;
        [HttpGet("GetPromotions")]
        public async Task<IActionResult> GetAllPromotion(bool available = false, int? customerId = null)
        {
            var result = await PromotionService.GetPromotions(available, customerId);
            return Ok(result);
        }
        [HttpGet("GetPromotionById/{id}")]
        public async Task<IActionResult> GetPromotionById(int id)
        {
            var result = await PromotionService.GetPromotionById(id);
            return Ok(result);
        }
        [HttpPost("AddNewPromotion")]
        public async Task<IActionResult> AddPromotion(PromotionDto promotionDto)
        {
            var result = await PromotionService.CreatePromotion(promotionDto);
            return Ok(result);
        }
        [HttpDelete("DeletePromotion/{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var result = await PromotionService.DeletePromotion(id);
            return Ok(result);
        }

        [HttpPut("UpdatePromotion/{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, PromotionDto promotionDto)
        {
            var result = await PromotionService.UpdatePromotion(id, promotionDto);
            return Ok(result);
        }
    }
}
