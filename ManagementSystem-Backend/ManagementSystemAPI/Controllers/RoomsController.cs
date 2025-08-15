using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagementSystemAPI.Data;
using ManagementSystemAPI.DTOs;
using ManagementSystemAPI.Models;

namespace ManagementSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms()
        {
            var rooms = await _context.Rooms
                .AsNoTracking()
                .OrderBy(r => r.Name)
                .Select(r => new RoomDto(r.Id, r.Name, r.Capacity, r.Location, r.Features, r.IsActive, r.IsAvailable))
                .ToListAsync();

            return Ok(rooms);
        }

        // GET: api/rooms/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAvailableRooms()
        {
            var rooms = await _context.Rooms
                .AsNoTracking()
                .Where(r => r.IsActive && r.IsAvailable)
                .OrderBy(r => r.Name)
                .Select(r => new RoomDto(r.Id, r.Name, r.Capacity, r.Location, r.Features, r.IsActive, r.IsAvailable))
                .ToListAsync();

            return Ok(rooms);
        }

        // GET: api/rooms/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var r = await _context.Rooms.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (r == null) return NotFound();

            return new RoomDto(r.Id, r.Name, r.Capacity, r.Location, r.Features, r.IsActive, r.IsAvailable);
        }

        // POST: api/rooms (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] CreateRoomDto dto)
        {
            var room = new Room
            {
                Name = dto.Name,
                Capacity = dto.Capacity,
                Location = dto.Location,
                Features = dto.Features,
                IsActive = dto.IsActive,
                IsAvailable = dto.IsAvailable
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var outDto = new RoomDto(room.Id, room.Name, room.Capacity, room.Location, room.Features, room.IsActive, room.IsAvailable);
            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, outDto);
        }

        // PUT: api/rooms/{id} (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomDto dto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.Name = dto.Name;
            room.Capacity = dto.Capacity;
            room.Location = dto.Location;
            room.Features = dto.Features;
            room.IsActive = dto.IsActive;
            room.IsAvailable = dto.IsAvailable;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/rooms/{id} (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
