using AutoMapper;
using BusinessObjects.DTO;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WarrantyController(IWarrantyService warrantyService, IMapper mapper) : ControllerBase
{
    private IWarrantyService WarrantyService { get; } = warrantyService;
    public IMapper Mapper { get; } = mapper;

    [HttpGet("GetWarranties")]
    public async Task<IActionResult> Get()
    {
        var warranties = await WarrantyService.GetWarranties();
        return Ok(warranties);
    }
    [HttpGet("GetWarrantyById/{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var warranty = await WarrantyService.GetWarrantyById(id);
        return Ok(warranty);
    }
    [HttpPost("CreateWarranty")]
    public async Task<IActionResult> CreateWarranty(WarrantyDto warrantyDto)
    {
        var result = await WarrantyService.CreateWarranty(warrantyDto);
        return Ok(result);
    }
    [HttpPut("UpdateWarranty/{id}")]
    public async Task<IActionResult> UpdateWarranty(int id, WarrantyDto warrantyDto)
    {
        var result = await WarrantyService.UpdateWarranty(id, warrantyDto);
        return Ok(result);
    }
}
