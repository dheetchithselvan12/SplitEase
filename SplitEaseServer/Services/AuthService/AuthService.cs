using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Nodes;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using SplitEase.Data;
using SplitEase.DTO;
using SplitEase.Utils;
using SplitEase.Models;

namespace SplitEase.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly DbConnection _conn;
    private readonly IConfiguration _configuration;

    private readonly CustomResponse _res = new();
    private readonly AuthDto _dto = new();

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _conn = context.Database.GetDbConnection();
        _configuration = configuration;
    }

    public async Task<CustomResponse> Register(JObject obj)
    {
        try
        {
            var register = obj.ToObject<RegisterDto>();

            if (register == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Invalid register data;";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            if (string.IsNullOrWhiteSpace(register.Name))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Name is required";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            if (string.IsNullOrWhiteSpace(register.Mobile))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Mobile number is required.";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            if (string.IsNullOrWhiteSpace(register.Password))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Password is required.";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            var existingUser = await _conn.QueryFirstOrDefaultAsync<User>(
                "usp_GetUserByMobile", new { p_Mobile = register.Mobile },
                commandType: CommandType.StoredProcedure
            );

            if (existingUser != null)
            {
                _res.IsSuccess = false;
                _res.Title = "Already Exists";
                _res.Message = "Mobile number already registered.";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            string passwordHash =
                BCrypt.Net.BCrypt.HashPassword(register.Password);

            var createdUser =
                await _conn.QueryFirstOrDefaultAsync<User>(
                        "usp_RegisterUser",
                        new
                        {
                            p_Name = register.Name,
                            p_Mobile = register.Mobile,
                            p_PasswordHash = passwordHash
                        },
                        commandType: CommandType.StoredProcedure
                    );

            if (createdUser == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Error";
                _res.Message = "Unable to register user.";
                _res.StatusCode = StatusCodes.Status500InternalServerError;

                return _res;
            }

            _dto.UserId = createdUser.UserId;
            _dto.Name = createdUser.Name;
            _dto.Mobile = createdUser.Mobile;

            _res.IsSuccess = true;
            _res.Title = "Created";
            _res.Message = "User Registered Successfully";
            _res.StatusCode = StatusCodes.Status201Created;
            _res.Data = _dto;

        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
            _res.StatusCode = StatusCodes.Status500InternalServerError;
            
        }

        return _res;
    }

    public async Task<CustomResponse> Login(JObject obj)
    {
        try
        {
            var login = obj.ToObject<LoginDto>();

            if (login == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Invalid login data.";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            if (string.IsNullOrWhiteSpace(login.Mobile))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Mobile number is required.";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }
            
            if (string.IsNullOrWhiteSpace(login.Password))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Password is required.";
                _res.StatusCode = StatusCodes.Status400BadRequest;

                return _res;
            }

            var user = await _conn.QueryFirstOrDefaultAsync<User>(
                    "usp_GetUserByMobile",
                    new
                    {
                        p_Mobile = login.Mobile
                    },
                    commandType: CommandType.StoredProcedure
                );

            if (user == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Unauthorized";
                _res.Message = "Invalid mobile number or password.";
                _res.StatusCode = StatusCodes.Status401Unauthorized;

                return _res;
            }

            bool isPasswordValid =
                BCrypt.Net.BCrypt.Verify(
                        login.Password, user.PasswordHash
                    );

            if (!isPasswordValid)
            {
                _res.IsSuccess = false;
                _res.Title = "Unauthorized";
                _res.Message = "Invalid mobile number or password.";
                _res.StatusCode = StatusCodes.Status401Unauthorized;

                return _res;
            }

            string token = GenerateToken(user);

            _dto.UserId = user.UserId;
            _dto.Name = user.Name;
            _dto.Mobile = user.Mobile;
            _dto.Token = token;

            _res.IsSuccess = true;
            _res.Title = "Success";
            _res.Message = "Login Successful";
            _res.StatusCode = StatusCodes.Status200OK;
            _res.Data = _dto;
        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
            _res.StatusCode = StatusCodes.Status500InternalServerError;
        }
        
        Console.WriteLine("User Data", _res);

        return _res;
    }

    private string GenerateToken(User user)
    {
        var jwtKey =
            _configuration["jwt:Key"]
            ?? throw new Exception("JWT key not configured");

        var securityKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
                );

        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256
                );

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.UserId.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.Name
            ),

            new Claim(
                ClaimTypes.MobilePhone,
                user.Mobile
            )
        };

        var token =
            new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
                );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
};
