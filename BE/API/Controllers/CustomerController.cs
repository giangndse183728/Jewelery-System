using BusinessObjects.DTO;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomerController(ICustomerService customerService) : ControllerBase
{
    private ICustomerService CustomerService { get; } = customerService;
    [HttpGet]
    public async Task<IActionResult> GetCustomers()
    {
        return Ok(await CustomerService.GetCustomers());
    }
    [HttpGet("GetCustomerById/{id}")]
    public async Task<IActionResult> GetCustomerById(int id)
    {
        return Ok(await CustomerService.GetCustomerById(id));
    }
    [HttpPost("CreateCustomer")]
    public async Task<IActionResult> CreateCustomer(CustomerDto customer)
    {
        var result = await CustomerService.CreateCustomer(customer);
        return Ok(result);
    }
    [HttpPut("UpdateCustomer/{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, CustomerDto customer)
    {
        var result = await CustomerService.UpdateCustomer(id, customer);
        return Ok(result);
    }
    [HttpDelete("DeleteCustomer/{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var result = await CustomerService.DeleteCustomer(id);
        return Ok(result);
    }
}
