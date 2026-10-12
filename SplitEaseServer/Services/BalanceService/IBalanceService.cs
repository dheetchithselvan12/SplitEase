using SplitEase.Utils;

namespace SplitEase.Services.BalanceService;

public interface IBalanceService
{
    Task<CustomResponse> ViewInit(int groupId);
}