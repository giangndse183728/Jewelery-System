using AutoMapper;
using BusinessObjects.DTO.Counter;
using BusinessObjects.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation;

public class CounterService : ICounterService
{
    public ICounterRepository Repository;
    private IMapper _mapper;

    public CounterService(ICounterRepository repository, IMapper mapper)
    {
        Repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CounterDTO?>?> Gets()
    {
        var counters = await Repository.Gets();
        return _mapper.Map<IEnumerable<CounterDTO?>>(counters);
    }

    public async Task<Counter?> GetById(int id)
    {
        return await Repository.GetById(id);
    }

    public async Task<int> Create(Counter counter)
    {
        return await Repository.Create(counter);
    }

    public async Task<int> Update(int id, Counter counter)
    {
        return await Repository.Update(id, counter);
    }
}