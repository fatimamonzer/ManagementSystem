using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagementSystemAPI.Data;
using ManagementSystemAPI.DTOs;
using ManagementSystemAPI.Models;
using System.Security.Claims;

namespace ManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bookings (Admin only)
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Select(b => new BookingDto(
                    b.Id, 
                    b.RoomId, 
                    b.UserId, 
                    b.StartTime, 
                    b.EndTime, 
                    b.User != null ? b.User.Username : "Unknown"))
                .ToListAsync();

            return Ok(bookings);
        }

        // GET: api/bookings/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null) return NotFound();

            return new BookingDto(
                booking.Id,
                booking.RoomId,
                booking.UserId,
                booking.StartTime,
                booking.EndTime,
                booking.User != null ? booking.User.Username : "Unknown");
        }

        // POST: api/bookings
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto dto)
        {
            // Get logged-in user's ID from JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);

            // Check if room exists
            var room = await _context.Rooms.FindAsync(dto.RoomId);
            if (room == null || !room.IsAvailable) return BadRequest("Room not available.");

            // Prevent overlapping bookings
            var overlap = await _context.Bookings
                .AnyAsync(b => b.RoomId == dto.RoomId &&
                               b.StartTime < dto.EndTime &&
                               b.EndTime > dto.StartTime);
            if (overlap) return BadRequest("Room is already booked for this time slot.");

            var booking = new Booking
            {
                RoomId = dto.RoomId,
                UserId = userId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id },
                new BookingDto(
                    booking.Id,
                    booking.RoomId,
                    booking.UserId,
                    booking.StartTime,
                    booking.EndTime,
                    user?.Username ?? "Unknown"));
        }

        // PUT: api/bookings/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, UpdateBookingDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userIdClaim == null || (booking.UserId != int.Parse(userIdClaim) && userRole != "Admin"))
                return Forbid();

            var overlap = await _context.Bookings
                .AnyAsync(b => b.RoomId == booking.RoomId &&
                               b.Id != id &&
                               b.StartTime < dto.EndTime &&
                               b.EndTime > dto.StartTime);
            if (overlap) return BadRequest("Room is already booked for this time slot.");

            booking.StartTime = dto.StartTime;
            booking.EndTime = dto.EndTime;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/bookings/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userIdClaim == null || (booking.UserId != int.Parse(userIdClaim) && userRole != "Admin"))
                return Forbid();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/bookings/room/{roomId}/available
        [Authorize]
        [HttpGet("room/{roomId}/available")]
        public async Task<ActionResult<bool>> IsRoomAvailable(int roomId, DateTime start, DateTime end)
        {
            var overlap = await _context.Bookings
                .AnyAsync(b => b.RoomId == roomId &&
                               b.StartTime < end &&
                               b.EndTime > start);
            return Ok(!overlap);
        }
    }
}
