
using AutoMapper;
using BusinessObjects.DTO.Jewelry;
using BusinessObjects.Models;
using Domain.Constants;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class JewelryController(IJewelryService jewelryService, IMapper mapper) : ControllerBase
{
    private IJewelryService JewelryService { get; } = jewelryService;
    private IMapper Mapper { get; } = mapper;

    [HttpGet("GetJewelries")]
    public async Task<IActionResult> GetJewelries(EnumBillType? type)
    {
        // lấy ra userid trong claims
        var jewelries = await JewelryService.GetJewelries(type);
        return Ok(jewelries);
    }
    [HttpGet("GetJewelryById/{id}")]
    public async Task<IActionResult> GetJewelryById(int id)
    {
        var jewelry = await JewelryService.GetJewelryById(id);
        if (jewelry == null) return NotFound();
        return Ok(jewelry);
    }
    [HttpPost("CreateJewelry")]
    public async Task<IActionResult> CreateJewelry(JewelryRequestDto jewelryRequestDto)
    {
        var result = await JewelryService.CreateJewelry(jewelryRequestDto);
        return Ok(result);
    }
    [HttpPut("UpdateJewelry/{id}")]
    public async Task<IActionResult> UpdateJewelry(int id, JewelryRequestDto jewelryRequestDto)
    {
        var jewelry = Mapper.Map<Jewelry>(jewelryRequestDto);
        var material = jewelryRequestDto.JewelryMaterial;
        var jwMaterial = new JewelryMaterial()
        {
            JewelryMaterialId = material.JewelryMaterialId,
            JewelryId = jewelry.JewelryId,
            GoldWeight = material.GoldWeight,
            StoneQuantity = material.GemQuantity,
            GoldId = material.GoldId,
            GemId = material.GemId,
        };
        jewelry.JewelryMaterials = new List<JewelryMaterial> { jwMaterial };
        var result = await JewelryService.UpdateJewelry(id, jewelry);
        return Ok(result);
    }
    [HttpDelete("DeleteJewelry/{id}")]
    public async Task<IActionResult> DeleteJewelry(int id)
    {
        var result = await JewelryService.DeleteJewelry(id);
        return Ok(result);
    }
}
