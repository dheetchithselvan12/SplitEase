using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SplitEase.Services.AuthService;

namespace SplitEase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;


    public AuthController(
        IAuthService authService)
    {
        _authService = authService;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(JObject obj)
        => Ok(await _authService.Register(obj));


    [HttpPost("login")]
    public async Task<IActionResult> Login(JObject obj)
        => Ok(await _authService.Login(obj));
}