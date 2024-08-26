using BusinessObjects.Models;

namespace Services.Interface;

public interface IJewelryTypeService
{
    Task<IEnumerable<JewelryType?>?> GetJewelry();
    Task<JewelryType?> GetJewelryById(int id);
    Task<int> CreateJewelry(JewelryType jewelryType);
    Task<int> UpdateJewelry(int id, JewelryType jewelryType);
}