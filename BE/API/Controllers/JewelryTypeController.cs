using AutoMapper;
using BusinessObjects.DTO;
using BusinessObjects.Models;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class JewelryTypeController(IJewelryTypeService service, IMapper mapper) : ControllerBase
{
    private IJewelryTypeService Service { get; } = service;
    private IMapper Mapper { get; } = mapper;

    [HttpGet("GetJewelryTypes")]
    public async Task<IActionResult> Get()
    {
        var jewelryTypes = await Service.GetJewelry();
        return Ok(jewelryTypes);
    }
    [HttpGet("GetJewelryById/{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var jewelryType = await Service.GetJewelryById(id);
        return Ok(jewelryType);
    }
    [HttpPost("CreateJewelryType")]
    public async Task<IActionResult> CreateJewelryType(JewelryTypeDto jewelryType)
    {
        var result = await Service.CreateJewelry(Mapper.Map<JewelryType>(jewelryType));
        return Ok(result);
    }
    [HttpPut("UpdateJewelryType/{id}")]
    public async Task<IActionResult> UpdateJewelryType(int id, JewelryTypeDto jewelryType)
    {
        var result = await Service.UpdateJewelry(id, Mapper.Map<JewelryType>(jewelryType));
        return Ok(result);
    }
}