using BusinessObjects.DTO;
using BusinessObjects.DTO.ResponseDto;

namespace Services.Interface
{
    public interface ICustomerService
    {
        public Task<IEnumerable<CustomerResponseDto?>?> GetCustomers();
        public Task<CustomerResponseDto?> GetCustomerById(int id);
        public Task<int> CreateCustomer(CustomerDto customer);
        public Task<int> UpdateCustomer(int id, CustomerDto customer);
        public Task<int> DeleteCustomer(int id);
    }
}
