namespace TaskManager.API.Models;

public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }

    public int? AssignedToId { get; set; }
    public User? AssignedTo { get; set; }

    public int ProjectId { get; set; }
    public Project? Project { get; set; }

    public required string Status { get; set; } // "Todo", "InProgress", "Completed"
    
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
