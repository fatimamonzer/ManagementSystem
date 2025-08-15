using ManagementSystemAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ManagementSystemAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Meeting> Meetings { get; set; } = null!;
        public DbSet<MinutesOfMeeting> MinutesOfMeetings { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Convert UserRole enum to string for MySQL
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>()   // store enum as VARCHAR
                .HasMaxLength(50);         // optional, adjust length if needed
        }
    }
}
