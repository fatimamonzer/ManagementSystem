using ManagementSystemAPI.Models;
namespace ManagementSystemAPI.DTOs
{
    // User DTO
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string? Email { get; set; }
        public UserRole Role { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }

        public UserDto() { }

        public UserDto(int id, string username, string? email, UserRole role, string? phone, string? avatar)
        {
            Id = id;
            Username = username;
            Email = email;
            Role = role;
            Phone = phone;
            Avatar = avatar;
        }
    }

    // Auth DTOs
    public class LoginDto
    {
        public string UsernameOrEmail { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public UserRole Role { get; set; }
        public string? Phone { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; } = null!;
        public UserDto User { get; set; } = null!;

        public AuthResponse(string token, UserDto user)
        {
            Token = token;
            User = user;
        }
    }
}
