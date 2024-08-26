using AutoMapper;
using BusinessObjects.DTO;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation
{
    public class CustomerService(IMapper mapper, ICustomerRepository customerRepository) : ICustomerService
    {
        private IMapper Mapper { get; } = mapper;
        private ICustomerRepository CustomerRepository { get; } = customerRepository;

        public async Task<int> CreateCustomer(CustomerDto customerDto)
        {
            var customer = Mapper.Map<Customer>(customerDto);
            return await CustomerRepository.Create(customer);
        }

        public async Task<int> DeleteCustomer(int id)
        {
            return await CustomerRepository.Delete(id);
        }

        public async Task<CustomerResponseDto?> GetCustomerById(int id)
        {
            var customer = await CustomerRepository.GetById(id);
            var responseCustomer = Mapper.Map<CustomerResponseDto>(customer);
            return responseCustomer;
        }

        public async Task<IEnumerable<CustomerResponseDto?>?> GetCustomers()
        {
            var customers = await CustomerRepository.Gets();
            var responseCustomers = Mapper.Map<IEnumerable<CustomerResponseDto>>(customers);
            return responseCustomers;
        }

        public async Task<int> UpdateCustomer(int id, CustomerDto customerDto)
        {
            var customer = Mapper.Map<Customer>(customerDto);
            return await CustomerRepository.Update(id, customer);
        }
    }
}