using AutoMapper;
using BusinessObjects.Context;
using BusinessObjects.DTO;
using BusinessObjects.DTO.Counter;
using BusinessObjects.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CounterController(ICounterService service, IMapper mapper, JssatsContext _context) : ControllerBase
{
    private ICounterService Service { get; } = service;
    private IMapper Mapper { get; } = mapper;
    private JssatsContext Context { get; } = _context;

    [HttpGet("GetCounters")]
    public async Task<IActionResult> Get()
    {
        var counters = await Service.Gets();
        return Ok(counters);
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var counter = await Service.GetById(id);
        return Ok(counter);
    }

    [HttpPost("CreateCounter")]
    public async Task<IActionResult> CreateCounter(CounterDTO counterDTO)
    {
        var counter = Mapper.Map<Counter>(counterDTO);
        var result = await Service.Create(counter);
        return Ok(result);
    }

    [HttpPut("UpdateCounter/{id}")]
    public async Task<IActionResult> UpdateCounter(int id, CounterDTO counter)
    {
        var result = await Service.Update(id, Mapper.Map<Counter>(counter));
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ServiceResponse> Delete(int id)
    {
        var serviceResponse = new ServiceResponse();
        var user = await Context.Users.FirstOrDefaultAsync(x => x.CounterId == id);
        if (user != null)
        {
            return serviceResponse.OnError("Counter is being used by user");
        }

        // nếu trong bảng Bill có CounterId = id thì không cho xóa
        var bill = await Context.Bills.FirstOrDefaultAsync(x => x.CounterId == id);
        if (bill != null)
        {
            return serviceResponse.OnError("Counter is being used by bill");
        }

        var counter = await Context.Counters.FirstOrDefaultAsync(x => x.CounterId == id);
        if (counter == null)
        {
            return serviceResponse.OnError("Counter not found");

        }
        Context.Counters.Remove(counter);
        await Context.SaveChangesAsync();

        return serviceResponse.Onsuccess("Delete counter success");
    }
}