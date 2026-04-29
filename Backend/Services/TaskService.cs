namespace TaskManager.API.Services;

using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;

    public TaskService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItemDto> CreateTaskAsync(CreateTaskDto dto, int userId)
    {
        // Verify user is in project
        var isMember = await _context.ProjectMembers.AnyAsync(pm => pm.ProjectId == dto.ProjectId && pm.UserId == userId);
        if (!isMember) throw new Exception("Access denied to this project.");

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            ProjectId = dto.ProjectId,
            DueDate = dto.DueDate,
            Status = "Todo"
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task<IEnumerable<TaskItemDto>> GetTasksForProjectAsync(int projectId, int userId)
    {
        var isMember = await _context.ProjectMembers.AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);
        if (!isMember) throw new Exception("Access denied to this project.");

        var tasks = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync();

        return tasks.Select(MapToDto);
    }

    public async Task<TaskItemDto> UpdateTaskStatusAsync(int taskId, UpdateTaskStatusDto dto, int userId)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .ThenInclude(p => p!.Members)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null) throw new Exception("Task not found.");
        if (!task.Project!.Members.Any(m => m.UserId == userId)) throw new Exception("Access denied.");

        task.Status = dto.Status;
        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task AssignTaskAsync(int taskId, AssignTaskDto dto, int userId)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .ThenInclude(p => p!.Members)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null) throw new Exception("Task not found.");
        
        // Only admin of project can assign tasks? Let's say any member can assign if they are in the project.
        if (!task.Project!.Members.Any(m => m.UserId == userId)) throw new Exception("Access denied.");

        var isAssigneeMember = await _context.ProjectMembers.AnyAsync(pm => pm.ProjectId == task.ProjectId && pm.UserId == dto.UserId);
        if (!isAssigneeMember) throw new Exception("User to assign is not a member of this project.");

        task.AssignedToId = dto.UserId;
        await _context.SaveChangesAsync();
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync(int userId)
    {
        var userProjectIds = await _context.ProjectMembers
            .Where(pm => pm.UserId == userId)
            .Select(pm => pm.ProjectId)
            .ToListAsync();

        var tasks = await _context.Tasks
            .Where(t => userProjectIds.Contains(t.ProjectId))
            .ToListAsync();

        var now = DateTime.UtcNow.Date;

        return new DashboardStatsDto
        {
            TotalTasks = tasks.Count,
            CompletedTasks = tasks.Count(t => t.Status == "Completed"),
            PendingTasks = tasks.Count(t => t.Status == "Todo" || t.Status == "InProgress"),
            OverdueTasks = tasks.Count(t => t.DueDate.HasValue && t.DueDate.Value.Date < now && t.Status != "Completed")
        };
    }

    private TaskItemDto MapToDto(TaskItem task)
    {
        return new TaskItemDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            ProjectId = task.ProjectId,
            ProjectName = task.Project?.Name,
            AssignedToId = task.AssignedToId,
            AssignedToName = task.AssignedTo?.Name,
            Status = task.Status,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt
        };
    }
}
