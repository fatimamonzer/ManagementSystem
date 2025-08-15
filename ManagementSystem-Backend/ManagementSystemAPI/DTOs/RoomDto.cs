namespace ManagementSystemAPI.DTOs
{
    public record RoomDto(
        int Id,
        string Name,
        int Capacity,
        string Location,
        string? Features,
        bool IsActive,
        bool IsAvailable
    );

    public class CreateRoomDto
    {
        public string Name { get; set; } = default!;
        public int Capacity { get; set; }
        public string Location { get; set; } = default!;
        public string? Features { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsAvailable { get; set; } = true;
    }

    public class UpdateRoomDto
    {
        public string Name { get; set; } = default!;
        public int Capacity { get; set; }
        public string Location { get; set; } = default!;
        public string? Features { get; set; }
        public bool IsActive { get; set; }
        public bool IsAvailable { get; set; }
    }
}
