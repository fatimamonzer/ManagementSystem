namespace ManagementSystemAPI.DTO
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public UserDto User { get; set; }

        public AuthResponse(string token, UserDto user)
        {
            Token = token;
            User = user;
        }
    }
}
