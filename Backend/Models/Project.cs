namespace TaskManager.API.Models;

public class Project
{
    public int Id { get; set; }
    public required string Name { get; set; }
    
    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
