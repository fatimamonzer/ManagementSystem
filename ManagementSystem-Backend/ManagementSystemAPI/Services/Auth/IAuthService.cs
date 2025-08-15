using ManagementSystemAPI.DTOs;
using ManagementSystemAPI.Models;

namespace ManagementSystemAPI.Services.Auth
{
    public interface IAuthService
    {
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<AuthResponse?> LoginAsync(string usernameOrEmail, string password);
        Task<UserDto> RegisterAsync(string username, string email, string password, UserRole role, string? phone = null);
    }
}
