namespace ManagementSystemAPI.DTOs
{
    public class UpdateUserDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        
    }
}
