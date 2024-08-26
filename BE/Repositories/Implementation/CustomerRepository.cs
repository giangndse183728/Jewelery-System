using BusinessObjects.Models;
using DAO;
using Repositories.Interface;

namespace Repositories.Implementation
{
    public class CustomerRepository(CustomerDao customerDao) : ICustomerRepository
    {
        private CustomerDao CustomerDao { get; } = customerDao;

        public async Task<int> Create(Customer entity)
        {
            entity.Point = 0;
            return await CustomerDao.CreateCustomer(entity);
        }

        public async Task<IEnumerable<Customer>?> Gets()
        {
            return await CustomerDao.GetCustomers();
        }

        public async Task<Customer?> GetById(int id)
        {
            return await CustomerDao.GetCustomerById(id);
        }

        public Task<int> Update(int id, Customer entity)
        {
            return CustomerDao.UpdateCustomer(id, entity);
        }

        public async Task<int> Delete(int id)
        {
            return await CustomerDao.DeleteCustomer(id);
        }
    }
}
