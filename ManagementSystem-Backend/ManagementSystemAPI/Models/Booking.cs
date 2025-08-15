using System;
using System.Collections.Generic;

namespace ManagementSystemAPI.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // Navigation
        public Room? Room { get; set; }
        public User? User { get; set; }
    }
}
