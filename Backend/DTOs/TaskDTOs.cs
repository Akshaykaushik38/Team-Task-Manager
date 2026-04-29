namespace TaskManager.API.DTOs;

public class CreateTaskDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int ProjectId { get; set; }
    public DateTime? DueDate { get; set; }
}

public class UpdateTaskStatusDto
{
    public required string Status { get; set; } // "Todo", "InProgress", "Completed"
}

public class AssignTaskDto
{
    public int UserId { get; set; }
}

public class TaskItemDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public int? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public required string Status { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsOverdue => DueDate.HasValue && DueDate.Value.Date < DateTime.UtcNow.Date && Status != "Completed";
}

public class DashboardStatsDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
    public int OverdueTasks { get; set; }
}
