namespace TaskManager.API.Services;

using TaskManager.API.DTOs;

public interface ITaskService
{
    Task<TaskItemDto> CreateTaskAsync(CreateTaskDto dto, int userId);
    Task<IEnumerable<TaskItemDto>> GetTasksForProjectAsync(int projectId, int userId);
    Task<TaskItemDto> UpdateTaskStatusAsync(int taskId, UpdateTaskStatusDto dto, int userId);
    Task AssignTaskAsync(int taskId, AssignTaskDto dto, int userId);
    Task<DashboardStatsDto> GetDashboardStatsAsync(int userId);
}
