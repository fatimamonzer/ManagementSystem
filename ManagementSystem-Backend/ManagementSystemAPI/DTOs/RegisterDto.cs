using ManagementSystemAPI.Models;
using System.Text.Json.Serialization;

namespace ManagementSystemAPI.DTO
{
    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        // JSON enum converter (case-insensitive)
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; }

        public string? Phone { get; set; }
    }
}
