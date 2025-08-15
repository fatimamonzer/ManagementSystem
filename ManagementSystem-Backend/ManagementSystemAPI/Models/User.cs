using System.ComponentModel.DataAnnotations;

namespace ManagementSystemAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Password { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public UserRole Role { get; set; } = UserRole.Guest;

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        public string? Avatar { get; set; }

        // Navigation properties (if needed later)
        // public List<Booking> Bookings { get; set; } = new();
        // public List<Notification> Notifications { get; set; } = new();
    }
}
