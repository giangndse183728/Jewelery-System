using BusinessObjects.DTO;
using Management.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController(IUserManagement userManagement) : ControllerBase
{
    private IUserManagement UserManagement { get; } = userManagement;
    [HttpGet("GetUsers")]
    public async Task<IActionResult> Get(int? roleId, int? counterId, bool? hasCounter)
    {
        var users = await UserManagement.GetUsers(roleId, counterId, hasCounter);
        return Ok(users);
    }
    [HttpGet("GetUserById/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await UserManagement.GetUserById(id);
        if (user != null) return Ok(user);
        return NotFound(new { message = "User not found" });
    }
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<ServiceResponse> Login(LoginDto loginDto)
    {
        var serviceResponse = await UserManagement.Login(loginDto);
        return serviceResponse;
    }
    [HttpPost("AddUser")]
    public async Task<IActionResult> AddUser(UserDto userDto)
    {
        return Ok(await UserManagement.AddUser(userDto));
    }
    [HttpPut("UpdateUser/{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
    {
        var result = await UserManagement.UpdateUser(id, userDto);
        if (result > 0) return Ok(new { message = "Update user success" });
        return BadRequest(new { message = "Update user fail" });
    }
    [HttpDelete("DeleteUser/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var result = await UserManagement.DeleteUser(id);
        if (result > 0) return Ok(new { message = "Delete user success" });
        return BadRequest(new { message = "Delete user fail" });
    }
}
