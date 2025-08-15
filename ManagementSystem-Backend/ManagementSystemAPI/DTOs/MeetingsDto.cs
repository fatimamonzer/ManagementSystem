using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class MeetingDto
{
    public int Id { get; set; }
    public int BookingId { get; set; }      // now matches the model
    public string Title { get; set; } = null!;
    public string? Agenda { get; set; }
    public string? Organizer { get; set; }
    public List<string> Attendees { get; set; } = new List<string>();

    // Booking info
    public string RoomName { get; set; } = "Unknown";
    public string Date { get; set; } = "";
    public string StartTime { get; set; } = "";
    public string EndTime { get; set; } = "";
}

public class CreateMeetingDto
    {
        [Required]
        public int BookingId { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        public string? Agenda { get; set; }

        public List<string> Attendees { get; set; } = new List<string>();
    }
