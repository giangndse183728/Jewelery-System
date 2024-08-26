using System.Net;

namespace Domain.Constants
{
    /// <summary>
    /// Trạng thái response trả về
    /// </summary>
    public enum ResponseStatus
    {
        Success = HttpStatusCode.OK,
        BadRequest = HttpStatusCode.BadRequest,
        Unauthorized = HttpStatusCode.Unauthorized,
        Forbidden = HttpStatusCode.Forbidden,
        NotFound = HttpStatusCode.NotFound,
        InternalServerError = HttpStatusCode.InternalServerError,
    }

    /// <summary>
    /// Enum loại file
    /// </summary>
    public enum EnumFileType
    {
        Temp = 0,
        Jewellery = 1,
    }

    /// <summary>
    /// Vai trò bên trong hệ thống
    /// </summary>
    public enum AppRole
    {
        Admin = 1,
        Manager = 2,
        Staff = 3,
    }

    /// <summary>
    /// Loại hóa đơn
    /// 1. Mua hàng
    /// 2. Bán hàng
    /// </summary>
    public enum EnumBillType
    {
        Sale = 1,
        Purchase = 2,
    }
}
