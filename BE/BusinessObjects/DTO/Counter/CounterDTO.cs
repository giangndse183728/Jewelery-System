namespace BusinessObjects.DTO.Counter
{
    public class CounterDTO
    {
        public int? CounterId { get; set; }
        public string? Name { get; set; }
        public int? NumOfStaff { get; set; } = 0;
        public virtual ICollection<UserCounter>? Users { get; set; } = [];
    }

    public class UserCounter
    {
        public int UserId { get; set; }
        public int? RoleId { get; set; }
        public int? CounterId { get; set; }
        public string? Code { get; set; }
        public string? FullName { get; set; }
    }
}
