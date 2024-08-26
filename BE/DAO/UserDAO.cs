using BusinessObjects.Context;
using BusinessObjects.DTO;
using BusinessObjects.Models;
using Domain.Constants;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class UserDao
    {
        private readonly JssatsContext _context;

        public UserDao()
        {
            _context = new JssatsContext();
        }
        public async Task<User?> GetUser(string email, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(p => p.Email == email && p.Password == password);
        }

        /// <summary>
        /// Lấy ra nhân viên không có counter
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<User?>?> GetStaffHasNoCounter()
        {
            return await _context.Users.Where(x => x.RoleId == (int)AppRole.Staff && x.CounterId == null).ToListAsync();
        }

        /// <summary>
        /// Lấy ra nhân viên theo counter
        /// </summary>
        /// <param name="counterId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<User?>?> GetStaffCounter(int counterId)
        {
            return await _context.Users.Where(x => x.RoleId == (int)AppRole.Staff && x.CounterId == counterId).ToListAsync();
        }
        public async Task<IEnumerable<User?>?> GetUsers(int? roleId, int? counterId, bool? hasCounter)
        {
            var userQuery = _context.Users.Include(x => x.Counter).AsQueryable();
            if (roleId != null)
            {
                userQuery = userQuery.Where(x => x.RoleId == roleId);
            }

            if (counterId != null)
            {
                userQuery = userQuery.Where(x => x.CounterId == counterId);
            }

            if (hasCounter != null)
            {
                userQuery = userQuery.Where(x => hasCounter == true ? x.CounterId != null : x.CounterId == null);
            }

            return await userQuery.ToListAsync();
        }
        public async Task<ServiceResponse> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new ServiceResponse { Message = "User created successfully" };
        }
        public async Task<int> CreateUser(User user)
        {
            await _context.Users.AddAsync(user);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateUser(int id, User user)
        {
            var existUser = await _context.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if (existUser == null) return 0;
            user.UserId = id;
            _context.Entry(existUser).CurrentValues.SetValues(user);
            _context.Entry(existUser).Property(x => x.Password).IsModified = false;
            _context.Entry(existUser).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }
        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }
        public async Task<int> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return 0;
            _context.Users.Remove(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                return 0;
            }
            return 1;
        }
    }
}
