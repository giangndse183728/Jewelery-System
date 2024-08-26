using AutoMapper;
using BusinessObjects.Context;
using BusinessObjects.DTO;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation
{
    public class UserService(IUserRepository userRepository, IMapper mapper, JssatsContext context) : IUserService
    {
        public IUserRepository UserRepository { get; } = userRepository;
        public IMapper Mapper { get; } = mapper;
        public JssatsContext Context { get; } = context;

        public async Task<User?> Login(LoginDto loginDto)
        {
            var user = await UserRepository.GetUser(loginDto.Email ?? "", loginDto.Password ?? "");
            return user ?? null;
        }

        public async Task<IEnumerable<UserDto?>?> GetUsers(int? roleId, int? counterId, bool? hasCounter)
        {
            return Mapper.Map<IEnumerable<UserDto?>?>(await UserRepository.Gets(roleId, counterId, hasCounter));
        }

        public async Task<bool> IsUser(LoginDto loginDto)
        {
            var users = await UserRepository.Find(a => a.Email == loginDto.Email && a.Password == loginDto.Password);
            return users.Any();
        }

        public async Task<int> UpdateUser(int id, UserDto userDto)
        {
            var user = Mapper.Map<User>(userDto);
            return await UserRepository.Update(id, user);
        }

        public async Task<ServiceResponse> AddUser(UserDto userDto)
        {
            var serviceResponse = new ServiceResponse();
            var user = Mapper.Map<User>(userDto);
            var userExist = await Context.Users.FirstOrDefaultAsync(a => a.Email == user.Email || a.Code == user.Code);
            if (userExist != null)
            {
                return serviceResponse.OnError("Email or Code already exists");
            }
            user.Counter = null;
            await UserRepository.Create(user);
            return serviceResponse.Onsuccess("User created successfully");
        }

        public Task<User?> GetUserById(int id)
        {
            return UserRepository.GetById(id);
        }

        public Task<int> DeleteUser(int id)
        {
            return UserRepository.Delete(id);
        }
    }
}
