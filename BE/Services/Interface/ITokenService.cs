using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;

namespace Services.Interface;

public interface ITokenService
{
    Task<TokenResponseDto> CreateToken(User user);
}