namespace TaskManager.API.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto)
    {
        var result = await _projectService.CreateProjectAsync(dto, GetCurrentUserId());
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var result = await _projectService.GetProjectsForUserAsync(GetCurrentUserId());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(int id)
    {
        var result = await _projectService.GetProjectByIdAsync(id, GetCurrentUserId());
        return Ok(result);
    }

    [HttpPost("{id}/members")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddMember(int id, [FromBody] AddMemberDto dto)
    {
        await _projectService.AddMemberToProjectAsync(id, dto, GetCurrentUserId());
        return Ok(new { message = "Member added successfully" });
    }

    [HttpGet("{id}/members")]
    public async Task<IActionResult> GetMembers(int id)
    {
        var result = await _projectService.GetProjectMembersAsync(id, GetCurrentUserId());
        return Ok(result);
    }

    [HttpDelete("{id}/members/{memberId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveMember(int id, int memberId)
    {
        await _projectService.RemoveMemberFromProjectAsync(id, memberId, GetCurrentUserId());
        return Ok(new { message = "Member removed successfully" });
    }
}
