using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ManagementSystemAPI.Models
{
    public class Meeting
{
    public int Id { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [ForeignKey("BookingId")]
    public Booking? Booking { get; set; }

    public string Title { get; set; } = null!;
    public string? Agenda { get; set; }
    public string? Attendees { get; set; }
    public string? Organizer { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

}
