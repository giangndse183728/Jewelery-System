using BusinessObjects.DTO;
using BusinessObjects.DTO.Bill;
using BusinessObjects.DTO.BillReqRes;
using BusinessObjects.Models;

namespace Management.Interface
{
    public interface IUserManagement
    {
        public Task<ServiceResponse?> Login(LoginDto loginDto);
        //Bill
        public Task<IEnumerable<BillDetailDto?>?> GetBills(int type);
        public Task<BillDetailDto?> GetBillById(int id);
        public Task<ServiceResponse> CreateBill(BillRequestDto billRequestDto);
        public Task<ServiceResponse> PayNow(int billId);
        //Crud User
        public Task<IEnumerable<UserDto?>?> GetUsers(int? roleId, int? counterId, bool? hasCounter);
        public Task<User?> GetUserById(int id);
        public Task<ServiceResponse> AddUser(UserDto userDto);
        public Task<int> UpdateUser(int id, UserDto userDto);
        public Task<int> DeleteUser(int id);
    }
}
