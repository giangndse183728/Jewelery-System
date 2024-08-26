using BusinessObjects.Context;
using BusinessObjects.DTO;
using DAO;
using Management.Implementation;
using Management.Interface;
using Repositories.Implementation;
using Repositories.Interface;
using Services.Implementation;
using Services.Interface;

namespace API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddScopeService(this IServiceCollection serviceCollection)
    {
        //Management
        serviceCollection.AddScoped<IUserManagement, UserManagement>();
        serviceCollection.AddScoped<JssatsContext>();
        serviceCollection.AddScoped<SessionContext>();
        //Repositories
        serviceCollection.AddScoped<IUserRepository, UserRepository>();
        serviceCollection.AddScoped<IJewelryRepository, JewelryRepository>();
        serviceCollection.AddScoped<IWarrantyRepository, WarrantyRepository>();
        serviceCollection.AddScoped<ICustomerRepository, CustomerRepository>();
        serviceCollection.AddScoped<IPromotionRepository, PromotionRepository>();
        serviceCollection.AddScoped<IBillRepository, BillRepository>();
        serviceCollection.AddScoped<IJewelryTypeRepository, JewelryTypeRepository>();
        serviceCollection.AddScoped<IGoldPriceRepository, GoldPriceRepository>();
        serviceCollection.AddScoped<IGemPriceRepository, GemPriceRepository>();
        serviceCollection.AddScoped<IBillPromotionRepository, BillPromotionRepository>();
        serviceCollection.AddScoped<IBillJewelryRepository, BillJewelryRepository>();
        serviceCollection.AddScoped<IBillDetailRepository, BillDetailRepository>();
        serviceCollection.AddScoped<IJewelryMaterialRepository, JewelryMaterialRepository>();
        serviceCollection.AddScoped<ICounterRepository, CounterRepository>();
        serviceCollection.AddHttpContextAccessor();
        //Services
        serviceCollection.AddScoped<IGemPriceService, GemPriceService>();
        serviceCollection.AddScoped<IGoldPriceService, GoldPriceService>();
        serviceCollection.AddScoped<IUserService, UserService>();
        serviceCollection.AddScoped<IJewelryService, JewelryService>();
        serviceCollection.AddScoped<IWarrantyService, WarrantyService>();
        serviceCollection.AddScoped<ICustomerService, CustomerService>();
        serviceCollection.AddScoped<IBillService, BillService>();
        serviceCollection.AddScoped<IPromotionService, PromotionService>();
        serviceCollection.AddScoped<IJewelryTypeService, JewelryTypeService>();
        serviceCollection.AddScoped<ITokenService, TokenService>();
        serviceCollection.AddScoped<ICounterService, CounterService>();
        serviceCollection.AddScoped<IVnPayService, VnPayService>();
        //DAO
        serviceCollection.AddScoped<BillDao>();
        serviceCollection.AddScoped<BillJewelryDao>();
        serviceCollection.AddScoped<BillPromotionDao>();
        serviceCollection.AddScoped<CustomerDao>();
        serviceCollection.AddScoped<GoldPriceDao>();
        serviceCollection.AddScoped<JewelryDao>();
        serviceCollection.AddScoped<JewelryTypeDao>();
        serviceCollection.AddScoped<PromotionDao>();
        serviceCollection.AddScoped<GemPriceDao>();
        serviceCollection.AddScoped<UserDao>();
        serviceCollection.AddScoped<WarrantyDao>();
        serviceCollection.AddScoped<JewelryMaterialDao>();
        serviceCollection.AddScoped<CounterDAO>();

        return serviceCollection;
    }
}