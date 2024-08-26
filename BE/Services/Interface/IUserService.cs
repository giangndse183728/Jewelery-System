using BusinessObjects.DTO;
using BusinessObjects.Models;

namespace Services.Interface
{
    public interface IUserService
    {
        public Task<User?> Login(LoginDto loginDto);
        public Task<IEnumerable<UserDto?>?> GetUsers(int? roleId, int? counterId, bool? hasCounter);
        public Task<bool> IsUser(LoginDto loginDto);
        public Task<ServiceResponse> AddUser(UserDto userDto);
        public Task<int> UpdateUser(int id, UserDto userDto);
        public Task<User?> GetUserById(int id);
        public Task<int> DeleteUser(int id);
    }
}
