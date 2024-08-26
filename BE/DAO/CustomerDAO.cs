using BusinessObjects.Context;
using BusinessObjects.Models;
using DAO.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAO
{
    public class CustomerDao : Singleton<CustomerDao>
    {
        public readonly JssatsContext _context;
        public CustomerDao()
        {
            _context = new JssatsContext();
        }
        public async Task<IEnumerable<Customer>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }
        public async Task<Customer?> GetCustomerById(int id)
        {
            return await _context.Customers.FindAsync(id);
        }
        public async Task<int> CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> UpdateCustomer(int id, Customer customer)
        {
            var existingCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == id);
            if (existingCustomer == null) return 0;
            customer.CustomerId = id;
            _context.Entry(existingCustomer).CurrentValues.SetValues(customer);
            _context.Entry(existingCustomer).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }
        public async Task<int> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return 0;
            }
            _context.Customers.Remove(customer);
            return await _context.SaveChangesAsync();
        }
        public async Task<Customer?> GetCustomerByBillId(int billId)
        {
            var bill = await _context.Bills.FindAsync(billId);
            if (bill == null) return null;
            return await _context.Customers.FindAsync(bill.CustomerId);
        }
    }
}
