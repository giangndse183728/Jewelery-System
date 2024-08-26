using BusinessObjects.DTO;
using BusinessObjects.DTO.Bill;
using BusinessObjects.DTO.BillReqRes;

namespace Services.Interface
{
    public interface IBillService
    {
        public Task<ServiceResponse> Create(BillRequestDto entity);
        public Task<IEnumerable<BillDetailDto?>?> GetBills(int type);
        public Task<BillDetailDto?> GetById(int id);
        public Task<ServiceResponse> PayNow(int billId);
    }
}
