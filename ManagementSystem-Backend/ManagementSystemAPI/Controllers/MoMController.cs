    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using ManagementSystemAPI.Data;
    using ManagementSystemAPI.Models;
    using ManagementSystemAPI.DTOs;
    using Microsoft.AspNetCore.Authorization;
    using System.IO;
    using QuestPDF.Fluent;
    using QuestPDF.Helpers;
    using QuestPDF.Infrastructure;

    namespace ManagementSystemAPI.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class MoMController : ControllerBase
        {
            private readonly ApplicationDbContext _context;
            private readonly IWebHostEnvironment _env;

            public MoMController(ApplicationDbContext context, IWebHostEnvironment env)
            {
                _context = context;
                _env = env;
            }

    // In MoMController
    [HttpGet("meetings")]
    public async Task<ActionResult<List<Meeting>>> GetAllMeetings()
    {
        var meetings = await _context.Meetings
            .AsNoTracking()
            .ToListAsync();
        return Ok(meetings);
    }


            // GET: /api/mom
            [HttpGet]
            public async Task<ActionResult<List<MoMDto>>> GetAllMoM()
            {
                var momList = await _context.MinutesOfMeetings
                    .Include(m => m.DiscussionPoints)
                    .Include(m => m.Decisions)
                    .Include(m => m.ActionItems)
                    .Include(m => m.Attachments)
                    .AsNoTracking()
                    .Select(m => new MoMDto
                    {
                        Id = m.Id,
                        MeetingId = m.MeetingId,
                        CreatedBy = m.CreatedBy,
                        CreatedAt = m.CreatedAt,
                        DiscussionPoints = m.DiscussionPoints.Select(d => d.Content).ToList(),
                        Decisions = m.Decisions.Select(d => d.Content).ToList(),
                        ActionItems = m.ActionItems.Select(a => new ActionItemResponseDto
                        {
                            Id = a.Id,
                            Content = a.Content,
                            AssignedTo = a.AssignedTo,
                            IsCompleted = a.IsCompleted
                        }).ToList(),
                        Files = m.Attachments.Select(f => new FileResponseDto
                        {
                            Id = f.Id,
                            FileName = f.FileName,
                            Url = $"/uploads/mom/{f.FileName}"
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(momList);
            }

            // GET: /api/mom/{meetingId}
            [HttpGet("{meetingId}")]
            public async Task<ActionResult<List<MoMDto>>> GetMoMByMeeting(int meetingId)
            {
                var momList = await _context.MinutesOfMeetings
                    .Where(m => m.MeetingId == meetingId)
                    .Include(m => m.DiscussionPoints)
                    .Include(m => m.Decisions)
                    .Include(m => m.ActionItems)
                    .Include(m => m.Attachments)
                    .AsNoTracking()
                    .Select(m => new MoMDto
                    {
                        Id = m.Id,
                        MeetingId = m.MeetingId,
                        CreatedBy = m.CreatedBy,
                        CreatedAt = m.CreatedAt,
                        DiscussionPoints = m.DiscussionPoints.Select(d => d.Content).ToList(),
                        Decisions = m.Decisions.Select(d => d.Content).ToList(),
                        ActionItems = m.ActionItems.Select(a => new ActionItemResponseDto
                        {
                            Id = a.Id,
                            Content = a.Content,
                            AssignedTo = a.AssignedTo,
                            IsCompleted = a.IsCompleted
                        }).ToList(),
                        Files = m.Attachments.Select(f => new FileResponseDto
                        {
                            Id = f.Id,
                            FileName = f.FileName,
                            Url = $"/uploads/mom/{f.FileName}"
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(momList);
            }

            // POST: /api/mom
            [HttpPost]
    public async Task<ActionResult<MoMDto>> CreateMoM([FromForm] CreateMoMDto dto)
    {
        // Create parent MoM
        var mom = new MinutesOfMeeting
        {
            MeetingId = dto.MeetingId,
            CreatedBy = dto.CreatedBy
        };

        // Discussion points
        if (dto.DiscussionPoints != null)
        {
            mom.DiscussionPoints.AddRange(dto.DiscussionPoints.Select(d => new DiscussionPoint
            {
                Content = d,
                MoM = mom
            }));
        }

        // Decisions
        if (dto.Decisions != null)
        {
            mom.Decisions.AddRange(dto.Decisions.Select(d => new Decision
            {
                Content = d,
                MoM = mom
            }));
        }

        // Action items
        if (dto.ActionItems != null)
        {
            mom.ActionItems.AddRange(dto.ActionItems.Select(a => new ActionItem
            {
                Content = a.Content,
                AssignedTo = a.AssignedTo,
                IsCompleted = false,
                MoM = mom 
            }));
        }

        // File uploads
        if (dto.Files != null && dto.Files.Count > 0)
        {
            var uploadDir = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", "mom");
            if (!Directory.Exists(uploadDir))
                Directory.CreateDirectory(uploadDir);

            foreach (var file in dto.Files)
            {
                var filePath = Path.Combine(uploadDir, file.FileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                mom.Attachments.Add(new FileAttachment
                {
                    FileName = file.FileName,
                    FilePath = filePath,
                    MoM = mom 
                });
            }
        }

        // Save everything to the database
        _context.MinutesOfMeetings.Add(mom);
        await _context.SaveChangesAsync();

        // Return DTO to frontend
        return Ok(new MoMDto
        {
            Id = mom.Id,
            MeetingId = mom.MeetingId,
            CreatedBy = mom.CreatedBy,
            CreatedAt = mom.CreatedAt,
            DiscussionPoints = mom.DiscussionPoints.Select(d => d.Content).ToList(),
            Decisions = mom.Decisions.Select(d => d.Content).ToList(),
            ActionItems = mom.ActionItems.Select(a => new ActionItemResponseDto
            {
                Id = a.Id,
                Content = a.Content,
                AssignedTo = a.AssignedTo,
                IsCompleted = a.IsCompleted
            }).ToList(),
            Files = mom.Attachments.Select(f => new FileResponseDto
            {
                Id = f.Id,
                FileName = f.FileName,
                Url = $"/uploads/mom/{f.FileName}"
            }).ToList()
        });
    }


            // GET: /api/mom/{id}/pdf
            [HttpGet("{id}/pdf")]
            public async Task<IActionResult> GetMoMPdf(int id)
            {
                var mom = await _context.MinutesOfMeetings
                    .Include(m => m.DiscussionPoints)
                    .Include(m => m.Decisions)
                    .Include(m => m.ActionItems)
                    .Include(m => m.Attachments)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (mom == null) return NotFound();

                var pdfBytes = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(2, Unit.Centimetre);
                        page.Header().Text($"Minutes of Meeting - Meeting {mom.MeetingId}").Bold().FontSize(20);
                        page.Content().Column(col =>
                        {
                            col.Item().Text($"Created By: {mom.CreatedBy}");
                            col.Item().Text($"Created At: {mom.CreatedAt:g}");
                            col.Item().Text("Discussion Points:").Bold();
                            foreach (var d in mom.DiscussionPoints)
                                col.Item().Text($"- {d}");

                            col.Item().Text("Decisions:").Bold();
                            foreach (var d in mom.Decisions)
                                col.Item().Text($"- {d}");

                            col.Item().Text("Action Items:").Bold();
                            foreach (var a in mom.ActionItems)
                                col.Item().Text($"- {a.Content} (Assigned to: {a.AssignedTo ?? "N/A"}, Completed: {a.IsCompleted})");
                        });
                        page.Footer().AlignCenter().Text(x => x.CurrentPageNumber());
                    });
                }).GeneratePdf();

                return File(pdfBytes, "application/pdf", $"MoM_{mom.Id}.pdf");
            }
        }
    }