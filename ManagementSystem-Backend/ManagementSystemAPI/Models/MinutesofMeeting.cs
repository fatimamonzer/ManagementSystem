using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManagementSystemAPI.Models
{
    public class MinutesOfMeeting
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MeetingId { get; set; }

        [ForeignKey("MeetingId")]
        public Meeting Meeting { get; set; } = null!;

        public List<DiscussionPoint> DiscussionPoints { get; set; } = new();
        public List<Decision> Decisions { get; set; } = new();
        public List<ActionItem> ActionItems { get; set; } = new();
        public List<FileAttachment> Attachments { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
    }

    public class DiscussionPoint
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        [Required]
        public int MinutesOfMeetingId { get; set; }

        [ForeignKey("MinutesOfMeetingId")]
        public MinutesOfMeeting MoM { get; set; } = null!;
    }

    public class Decision
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        [Required]
        public int MinutesOfMeetingId { get; set; }

        [ForeignKey("MinutesOfMeetingId")]
        public MinutesOfMeeting MoM { get; set; } = null!;
    }

    public class ActionItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        public string? AssignedTo { get; set; }
        public bool IsCompleted { get; set; } = false;

        [Required]
        public int MinutesOfMeetingId { get; set; }

        [ForeignKey("MinutesOfMeetingId")]
        public MinutesOfMeeting MoM { get; set; } = null!;
    }

    public class FileAttachment
    {
        [Key]
        public int Id { get; set; }

        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!; 

        [Required]
        public int MinutesOfMeetingId { get; set; }

        [ForeignKey("MinutesOfMeetingId")]
        public MinutesOfMeeting MoM { get; set; } = null!;
    }
}
