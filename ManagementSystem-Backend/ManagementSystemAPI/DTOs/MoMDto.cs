using Microsoft.AspNetCore.Http;

namespace ManagementSystemAPI.DTOs
{
    // DTO for creating a new MoM
    public class CreateMoMDto
    {
        public int MeetingId { get; set; }
        public string CreatedBy { get; set; } = null!;
        public List<string>? DiscussionPoints { get; set; }
        public List<string>? Decisions { get; set; }
        public List<ActionItemDto>? ActionItems { get; set; }
        public List<IFormFile>? Files { get; set; }
    }

    public class ActionItemDto
    {
        public string Content { get; set; } = null!;
        public string? AssignedTo { get; set; }
    }

    // DTO for updating an existing MoM
    public class UpdateMoMDto
    {
        public List<string>? DiscussionPoints { get; set; }
        public List<string>? Decisions { get; set; }
        public List<ActionItemUpdateDto>? ActionItems { get; set; }
    }

    public class ActionItemUpdateDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string? AssignedTo { get; set; }
        public bool IsCompleted { get; set; }
    }

    // DTO for returning MoM to frontend
    public class MoMDto
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public List<string> DiscussionPoints { get; set; } = new();
        public List<string> Decisions { get; set; } = new();
        public List<ActionItemResponseDto> ActionItems { get; set; } = new();
        public List<FileResponseDto> Files { get; set; } = new();
    }

    public class ActionItemResponseDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string? AssignedTo { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class FileResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = null!;
        public string Url { get; set; } = null!;
    }
}
