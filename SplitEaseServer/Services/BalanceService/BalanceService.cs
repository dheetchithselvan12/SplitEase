using System.Data;
using System.Data.Common;
using Dapper;
using Microsoft.EntityFrameworkCore;
using SplitEase.Data;
using SplitEase.DTO;
using SplitEase.Utils;

namespace SplitEase.Services.BalanceService;

public class BalanceService : IBalanceService
{
    private readonly AppDbContext _context;
    private readonly DbConnection _conn;

    private readonly CustomResponse _res = new();
    private readonly BalanceDto _dto = new();

    public BalanceService(AppDbContext context)
    {
        _context = context;
        _conn = context.Database.GetDbConnection();
    }

    public async Task<CustomResponse> ViewInit(int groupId)
    {
        try
        {
            if (groupId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Invalid Group Id.";

                return _res;
            }

            _dto.UserBalances =
            (
                await _conn.QueryAsync<UserBalanceDto>(
                    "usp_GetGroupBalances",
                    new
                    {
                        p_GroupId = groupId
                    },
                    commandType: CommandType.StoredProcedure
                )
            ).ToList();

            if (_dto.UserBalances.Count == 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Not Found";
                _res.Message = "Group not found or group has no members.";

                return _res;
            }

            var debtors =
                _dto.UserBalances
                    .Where(x => x.FinalBalance < 0)
                    .Select(x => new UserBalanceDto
                        {
                            UserId = x.UserId,
                            Name = x.Name,
                            FinalBalance = Math.Abs(x.FinalBalance)
                        }
                    ).ToList();

            var creditors = _dto.UserBalances
                .Where(x => x.FinalBalance > 0)
                .Select(x => new UserBalanceDto
                {
                    UserId = x.UserId,
                    Name = x.Name,
                    FinalBalance = x.FinalBalance
                }).ToList();

            var debts = new List<DebtDto>();
            int debtorIndex = 0;
            int creditorIndex = 0;

            while (debtorIndex < debtors.Count && creditorIndex < creditors.Count)
            {
                var debtor = debtors[debtorIndex];
                var creditor = creditors[creditorIndex];

                decimal amount = Math.Min(
                    debtor.FinalBalance,
                    creditor.FinalBalance
                    );

                amount = Math.Round(amount, 2, MidpointRounding.AwayFromZero);

                if (amount > 0)
                {
                    debts.Add(
                        new DebtDto
                        {
                            FromUserId = debtor.UserId,
                            FromUserName = debtor.Name,
                            ToUserId = creditor.UserId,
                            ToUserName = creditor.Name,
                            Amount = amount
                        }
                        );
                }

                debtor.FinalBalance -= amount;
                creditor.FinalBalance -= amount;

                if (debtor.FinalBalance <= 0)
                {
                    debtorIndex++;
                }

                if (creditor.FinalBalance <= 0)
                {
                    creditorIndex++;
                }
            }

            _dto.Debts = debts;
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
