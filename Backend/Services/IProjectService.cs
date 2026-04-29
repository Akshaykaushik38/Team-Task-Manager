namespace TaskManager.API.Services;

using TaskManager.API.DTOs;

public interface IProjectService
{
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto, int userId);
    Task<IEnumerable<ProjectDto>> GetProjectsForUserAsync(int userId);
    Task<ProjectDto> GetProjectByIdAsync(int id, int userId);
    Task AddMemberToProjectAsync(int projectId, AddMemberDto dto, int currentUserId);
    Task RemoveMemberFromProjectAsync(int projectId, int memberId, int currentUserId);
    Task<IEnumerable<ProjectMemberDto>> GetProjectMembersAsync(int projectId, int userId);
}
