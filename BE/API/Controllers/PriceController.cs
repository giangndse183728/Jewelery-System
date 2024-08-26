using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriceController(IGoldPriceService goldPriceService, IGemPriceService gemPriceService) : ControllerBase
    {
        private IGoldPriceService GoldPriceService { get; } = goldPriceService;
        public IGemPriceService GemPriceService { get; } = gemPriceService;

        [HttpGet("GetGoldPrices")]
        public async Task<IActionResult> GetGoldPrices()
        {
            var goldPrices = await GoldPriceService.GetGoldPrices();
            return Ok(goldPrices);
        }
        [HttpGet("GetGemPrices")]
        public async Task<IActionResult> GetGemPrices()
        {
            var gemPrices = await GemPriceService.GetGemPrices();
            return Ok(gemPrices);
        }
    }
}
