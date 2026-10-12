using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SplitEase.Services.SettlementService;

namespace SplitEase.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class SettlementController : ControllerBase
{
    private readonly ISettlementService _settlementService;

    public SettlementController(ISettlementService settlementService)
    {
        _settlementService = settlementService;
    }

    [HttpGet("ViewInit/{groupId:int}")]
    public async Task<IActionResult> ViewInit(int groupId)
        => Ok(await _settlementService.ViewInit(groupId));

    [HttpPost("Create")]
    public async Task<IActionResult> Create(JObject obj)
        => Ok(await _settlementService.Create(obj));
}
