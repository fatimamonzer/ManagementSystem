using ManagementSystemAPI.Data;
using ManagementSystemAPI.DTOs;
using ManagementSystemAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace ManagementSystemAPI.Services.Auth
{
    
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
             _config = config;

            _passwordHasher = new PasswordHasher<User>();
        }

        // Get user by ID
        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return null;

            return new UserDto(
                user.Id,
                user.Username,
                user.Email,
                user.Role,
                user.Phone,
                user.Avatar
            );
        }

 // Login with JWT
        public async Task<AuthResponse?> LoginAsync(string usernameOrEmail, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u =>
                u.Username == usernameOrEmail || u.Email == usernameOrEmail);

            if (user == null) return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, password);
            if (result != PasswordVerificationResult.Success) return null;

            var userDto = new UserDto(
                user.Id,
                user.Username,
                user.Email,
                user.Role,
                user.Phone,
                user.Avatar
            );

            // Generate JWT token
var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new Exception("JWT key missing"));

var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role.ToString())
};

var tokenDescriptor = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(claims),
    Expires = DateTime.UtcNow.AddHours(2),
    Issuer = _config["Jwt:Issuer"],
    Audience = _config["Jwt:Audience"],
    SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha256
    )
};

var tokenHandler = new JwtSecurityTokenHandler();
var token = tokenHandler.CreateToken(tokenDescriptor);
var jwtToken = tokenHandler.WriteToken(token);


            return new AuthResponse(jwtToken, userDto);
        }


        // Register new user
        public async Task<UserDto> RegisterAsync(string username, string email, string password, UserRole role, string? phone = null)
        {
            // Check if username or email already exists
            if (await _db.Users.AnyAsync(u => u.Username == username || u.Email == email))
                throw new ArgumentException("Username or email already exists");

            var user = new User
            {
                Username = username,
                Email = email,
                Role = role,
                Phone = phone
            };

            // Hash the password
            user.Password = _passwordHasher.HashPassword(user, password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new UserDto(
                user.Id,
                user.Username,
                user.Email,
                user.Role,
                user.Phone,
                user.Avatar
            );
        }
    }
}
