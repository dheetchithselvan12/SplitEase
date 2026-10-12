using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SplitEase.Services.ExpenseService;

namespace SplitEase.Controllers;

[Authorize]
[ApiController]
[Route("api/[Controller]")]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpenseController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpGet("ViewInit/{groupId:int}")]
    public async Task<IActionResult> ViewInit(int groupId)
        => Ok(
            await _expenseService.ViewInit(groupId)
            );

    [HttpPost("Create")]
    public async Task<IActionResult> Create(JObject obj)
        => Ok(
            await _expenseService.Create(obj)
            );
}