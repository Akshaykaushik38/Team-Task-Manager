namespace TaskManager.API.Services;

using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;

    public ProjectService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto, int userId)
    {
        var project = new Project
        {
            Name = dto.Name,
            CreatedById = userId
        };

        // Add the creator as a member automatically
        project.Members.Add(new ProjectMember { UserId = userId });

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            CreatedById = project.CreatedById,
            CreatedAt = project.CreatedAt,
            MemberCount = 1,
            TaskCount = 0
        };
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsForUserAsync(int userId)
    {
        return await _context.Projects
            .Where(p => p.Members.Any(m => m.UserId == userId))
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                CreatedById = p.CreatedById,
                CreatedByName = p.CreatedBy!.Name,
                CreatedAt = p.CreatedAt,
                MemberCount = p.Members.Count,
                TaskCount = p.Tasks.Count
            })
            .ToListAsync();
    }

    public async Task<ProjectDto> GetProjectByIdAsync(int id, int userId)
    {
        var project = await _context.Projects
            .Include(p => p.CreatedBy)
            .Include(p => p.Members)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id && p.Members.Any(m => m.UserId == userId));

        if (project == null) throw new Exception("Project not found or access denied.");

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            CreatedById = project.CreatedById,
            CreatedByName = project.CreatedBy?.Name,
            CreatedAt = project.CreatedAt,
            MemberCount = project.Members.Count,
            TaskCount = project.Tasks.Count
        };
    }

    public async Task AddMemberToProjectAsync(int projectId, AddMemberDto dto, int currentUserId)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.CreatedById == currentUserId);
        if (project == null) throw new Exception("Project not found or only the creator can add members.");

        var userToAdd = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (userToAdd == null) throw new Exception("User with this email not found.");

        if (await _context.ProjectMembers.AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userToAdd.Id))
            throw new Exception("User is already a member of this project.");

        _context.ProjectMembers.Add(new ProjectMember { ProjectId = projectId, UserId = userToAdd.Id });
        await _context.SaveChangesAsync();
    }

    public async Task RemoveMemberFromProjectAsync(int projectId, int memberId, int currentUserId)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.CreatedById == currentUserId);
        if (project == null) throw new Exception("Project not found or only the creator can remove members.");

        if (project.CreatedById == memberId) throw new Exception("Creator cannot be removed from the project.");

        var member = await _context.ProjectMembers.FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == memberId);
        if (member == null) throw new Exception("Member not found in the project.");

        _context.ProjectMembers.Remove(member);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ProjectMemberDto>> GetProjectMembersAsync(int projectId, int userId)
    {
        var isMember = await _context.ProjectMembers.AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);
        if (!isMember) throw new Exception("Access denied.");

        return await _context.ProjectMembers
            .Where(pm => pm.ProjectId == projectId)
            .Select(pm => new ProjectMemberDto
            {
                UserId = pm.User!.Id,
                UserName = pm.User.Name,
                Role = pm.User.Role
            })
            .ToListAsync();
    }
}
