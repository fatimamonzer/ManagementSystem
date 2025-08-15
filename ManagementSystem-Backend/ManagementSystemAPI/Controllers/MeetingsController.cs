using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagementSystemAPI.Data;
using ManagementSystemAPI.DTOs;
using ManagementSystemAPI.Models;
using System.Text.Json;

namespace ManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeetingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MeetingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/meetings
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MeetingDto>>> GetMeetings()
        {
            var meetings = await _context.Meetings
                .Include(m => m.Booking)
                .ThenInclude(b => b.Room)
                .ToListAsync();

            var result = meetings.Select(m => new MeetingDto
            {
                Id = m.Id,
                BookingId = m.BookingId,
                Title = m.Title,
                Agenda = m.Agenda,
                Organizer = m.Organizer,
                Attendees = string.IsNullOrEmpty(m.Attendees)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(m.Attendees) ?? new List<string>(),
                RoomName = m.Booking?.Room?.Name ?? "Unknown",
                Date = m.Booking?.StartTime.ToString("yyyy-MM-dd") ?? "",
                StartTime = m.Booking?.StartTime.ToString("HH:mm") ?? "",
                EndTime = m.Booking?.EndTime.ToString("HH:mm") ?? ""
            }).ToList();

            return Ok(result);
        }

        // POST: api/meetings
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<MeetingDto>> CreateMeeting(CreateMeetingDto dto)
        {
            var username = User.Identity?.Name ?? "Unknown";

            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == dto.BookingId);

            if (booking == null) return BadRequest("Invalid booking ID");

            var meeting = new Meeting
            {
                BookingId = dto.BookingId,
                Title = dto.Title,
                Agenda = dto.Agenda,
                Organizer = username,
                Attendees = dto.Attendees != null ? JsonSerializer.Serialize(dto.Attendees) : null
            };

            _context.Meetings.Add(meeting);
            await _context.SaveChangesAsync();

            return Ok(new MeetingDto
            {
                Id = meeting.Id,
                BookingId = meeting.BookingId,
                Title = meeting.Title,
                Agenda = meeting.Agenda,
                Organizer = meeting.Organizer,
                Attendees = dto.Attendees ?? new List<string>(),
                RoomName = booking.Room?.Name ?? "Unknown",
                Date = booking.StartTime.ToString("yyyy-MM-dd"),
                StartTime = booking.StartTime.ToString("HH:mm"),
                EndTime = booking.EndTime.ToString("HH:mm")
            });
        }
    }
}
