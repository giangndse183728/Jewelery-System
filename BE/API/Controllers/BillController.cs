using BusinessObjects.DTO.Bill;
using Management.Interface;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BillController(IUserManagement userManagement) : ControllerBase
{
    private IUserManagement UserManagement { get; } = userManagement;
    [HttpGet("GetBills")]
    public async Task<IActionResult> Get(int type)
    {
        var bills = await UserManagement.GetBills(type);
        return Ok(bills);
    }
    [HttpGet("GetBillById/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var bill = await UserManagement.GetBillById(id);
        if (bill == null) return NotFound();
        return Ok(bill);
    }
    [HttpPost("CreateBill")]
    public async Task<IActionResult> Create(BillRequestDto billRequestDto)
    {
        var paymentUrl = await UserManagement.CreateBill(billRequestDto);
        return Ok(paymentUrl);
    }

    [HttpGet("PayNow/{billId}")]
    public async Task<IActionResult> PayNow(int billId)
    {
        var paymentUrl = await UserManagement.PayNow(billId);
        return Ok(paymentUrl);
    }
}
