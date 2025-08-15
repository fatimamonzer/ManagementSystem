using System.ComponentModel.DataAnnotations;

namespace ManagementSystemAPI.Models
{
    public class Room
    {
        [Key] public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = default!;            // e.g. "Room A"

        [Range(1, 1000)]
        public int Capacity { get; set; }                       // e.g. 12

        [Required, MaxLength(100)]
        public string Location { get; set; } = default!;        // e.g. "Floor 2"

        [MaxLength(500)]
        public string? Features { get; set; }                   // e.g. "Projector, Video Conferencing"

        public bool IsActive { get; set; } = true;              // for soft-hiding a room
        public bool IsAvailable { get; set; } = true;           // basic availability flag
    }
}
