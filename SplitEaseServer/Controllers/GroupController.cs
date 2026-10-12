using System.Security.Claims;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SplitEase.Services.GroupService;

namespace SplitEase.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class GroupController : ControllerBase
{
    private readonly IGroupService _groupService;

    public GroupController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    private int GetUserId()
    {
        return Convert.ToInt32(
            User.FindFirstValue((
                ClaimTypes.NameIdentifier
            ))
        );
    }

    [HttpGet("ViewInit")]
    public async Task<IActionResult> ViewInit()
        => Ok(
            await _groupService.ViewInit(
                GetUserId()
            )
        );

    [HttpGet("PageInit/{id:int}")]
    public async Task<IActionResult> PageInit(int id) => Ok(await _groupService.PageInit(id));

    [HttpPost("Create")]
    public async Task<IActionResult> Create(JObject obj)
        => Ok(
            await _groupService.Create(
                obj,
                GetUserId()
                )
            );

    [HttpPost("AddMember")]
    public async Task<IActionResult> AddMember(JObject obj)
        => Ok(
            await _groupService.AddMember(obj)
            );

    [HttpDelete("Delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => Ok(
            await _groupService.Delete(
                id,
                GetUserId()
                )
            );
}