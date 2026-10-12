namespace SplitEase.DTO;

public class AuthDto
{
    public int UserId { get; set; }
    public string? Name { get; set; }
    public string? Mobile { get; set; }
    public string? Token { get; set; }
}

public class RegisterDto
{
    public string? Name { get; set; }
    public string? Mobile { get; set; }
    public string? Password { get; set; }
}

public class LoginDto
{
    public string? Mobile { get; set; }
    public string? Password { get; set; }
}