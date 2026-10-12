using SplitEase.Utils;

namespace SplitEase.Services.DashboardService;

public interface IDashboardService
{
    Task<CustomResponse> PageInit(int userId);
}