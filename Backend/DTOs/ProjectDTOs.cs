namespace TaskManager.API.DTOs;

public class CreateProjectDto
{
    public required string Name { get; set; }
}

public class ProjectDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int CreatedById { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // For counting/showing members
    public int MemberCount { get; set; }
    public int TaskCount { get; set; }
}

public class ProjectMemberDto
{
    public int UserId { get; set; }
    public required string UserName { get; set; }
    public required string Role { get; set; }
}

public class AddMemberDto
{
    public required string Email { get; set; }
}
