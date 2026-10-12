using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SplitEase.Services.BalanceService;

namespace SplitEase.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class BalanceController : ControllerBase
{
    private readonly IBalanceService _balanceService;

    public BalanceController(IBalanceService balanceService)
    {
        _balanceService = balanceService;
    }

    [HttpGet("ViewInit/{groupId:int}")]
    public async Task<IActionResult> ViewInit(int groupId)
        => Ok(await _balanceService.ViewInit(groupId));
}