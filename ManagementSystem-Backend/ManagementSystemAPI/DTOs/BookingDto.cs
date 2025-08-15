namespace ManagementSystemAPI.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string BookedBy { get; set; } = "Unknown"; // NEW

        public BookingDto(int id, int roomId, int userId, DateTime startTime, DateTime endTime, string bookedBy)
        {
            Id = id;
            RoomId = roomId;
            UserId = userId;
            StartTime = startTime;
            EndTime = endTime;
            BookedBy = bookedBy;
        }
    }

    public class CreateBookingDto
    {
        public int RoomId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class UpdateBookingDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
