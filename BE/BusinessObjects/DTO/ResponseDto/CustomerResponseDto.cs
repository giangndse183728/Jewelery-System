namespace BusinessObjects.DTO.ResponseDto;

public class CustomerResponseDto
{
    public int CustomerId { get; set; }

    public string? Code { get; set; }

    public string? FullName { get; set; }

    public string? Email { get; set; }
    public string? Phone { get; set; }

    public string? Gender { get; set; }
    public string? Address { get; set; }
    public int Point { get; set; }
}