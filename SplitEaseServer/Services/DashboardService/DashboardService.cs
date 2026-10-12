using System.Data;
using System.Data.Common;
using Dapper;
using Microsoft.EntityFrameworkCore;
using SplitEase.Data;
using SplitEase.DTO;
using SplitEase.Utils;

namespace SplitEase.Services.DashboardService;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly DbConnection _conn;

    private readonly CustomResponse _res = new();
    private readonly DashboardDto _dto = new();

    public DashboardService(AppDbContext context)
    {
        _context = context;
        _conn = context.Database.GetDbConnection();
    }

    public async Task<CustomResponse> PageInit(int userId)
    {
        try
        {
            if (userId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Invalid User Id.";

                return _res;
            }

            using var multi =
                await _conn
                    .QueryMultipleAsync(
                        "usp_GetDashboard",
                        new
                        {
                            p_UserId = userId
                        },
                        commandType: CommandType.StoredProcedure
                    );

            _dto.Summary = await multi.ReadFirstOrDefaultAsync<DashboardSummaryDto>();
            _dto.GroupList = (
                    await multi.ReadAsync<DashboardGroupDto>()
                ).ToList();

            _dto.RecentExpenses =
            (
                await multi
                    .ReadAsync<DashboardExpenseDto>()
            ).ToList();

            _res.IsSuccess = true;
            _res.Data = _dto;

        }
        catch (Exception ex)
        {
            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }
}