using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SplitEase.Services.DashboardService;

namespace SplitEase.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    private int GetUserId()
    {
        return Convert.ToInt32(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            )
        );
    }

    [HttpGet("PageInit")]
    public async Task<IActionResult> PageInit() => Ok(
        await _dashboardService.PageInit(GetUserId())
    );
}