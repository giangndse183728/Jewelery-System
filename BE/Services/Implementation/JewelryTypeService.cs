using BusinessObjects.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services.Implementation;

public class JewelryTypeService(IJewelryTypeRepository repository) : IJewelryTypeService
{
    public IJewelryTypeRepository Repository { get; } = repository;

    public async Task<IEnumerable<JewelryType?>?> GetJewelry()
    {
        return await Repository.Gets();
    }

    public async Task<JewelryType?> GetJewelryById(int id)
    {
        return await Repository.GetById(id);
    }

    public async Task<int> CreateJewelry(JewelryType jewelryType)
    {
        return await Repository.Create(jewelryType);
    }

    public async Task<int> UpdateJewelry(int id, JewelryType jewelryType)
    {
        return await Repository.Update(id, jewelryType);
    }
}