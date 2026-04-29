namespace TaskManager.API.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        var result = await _taskService.CreateTaskAsync(dto, GetCurrentUserId());
        return Ok(result);
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetTasks(int projectId)
    {
        var result = await _taskService.GetTasksForProjectAsync(projectId, GetCurrentUserId());
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
    {
        var result = await _taskService.UpdateTaskStatusAsync(id, dto, GetCurrentUserId());
        return Ok(result);
    }

    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignTask(int id, [FromBody] AssignTaskDto dto)
    {
        await _taskService.AssignTaskAsync(id, dto, GetCurrentUserId());
        return Ok(new { message = "Task assigned successfully" });
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _taskService.GetDashboardStatsAsync(GetCurrentUserId());
        return Ok(result);
    }
}
