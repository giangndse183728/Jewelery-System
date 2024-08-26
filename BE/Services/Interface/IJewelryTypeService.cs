using BusinessObjects.DTO.Counter;
using BusinessObjects.Models;

namespace Services.Interface;

public interface ICounterService
{
    Task<Counter?> GetById(int id);
    Task<int> Create(Counter counter);
    Task<int> Update(int id, Counter counter);
    Task<IEnumerable<CounterDTO?>?> Gets();
}