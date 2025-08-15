using ManagementSystemAPI.Models;
using System.Text.Json.Serialization;

namespace ManagementSystemAPI.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    
        // Serialize the enum as string in JSON
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; }

        public string? Phone { get; set; }
        public string? Avatar { get; set; }

        public UserDto(int id, string username, string email, UserRole role, string? phone = null, string? avatar = null)
        {
            Id = id;
            Username = username;
            Email = email;
            Role = role;
            Phone = phone;
            Avatar = avatar;
        }
    }
}
