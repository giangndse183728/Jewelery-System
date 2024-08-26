using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;

namespace Repositories.Interface;

public interface IJewelryMaterialRepository : IReadRepository<JewelryMaterial>, ICreateRepository<JewelryMaterial>, IDeleteRepository<JewelryMaterial>
{

}