using BusinessObjects.DTO.BillReqRes;

namespace Repositories.Implementation;

public interface IBillDetailRepository
{
    Task AddBillDetail(BillDetailDto billDetail);
    Task<IEnumerable<BillDetailDto>> GetBillDetails();
    Task<BillDetailDto> GetBillDetail(int billId);
}