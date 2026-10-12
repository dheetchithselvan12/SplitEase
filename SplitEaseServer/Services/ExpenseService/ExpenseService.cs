using System.Data;
using System.Data.Common;
using System.Text.Json.Nodes;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using SplitEase.Data;
using SplitEase.DTO;
using SplitEase.Models;
using SplitEase.Utils;

namespace SplitEase.Services.ExpenseService;

public class ExpenseService : IExpenseService
{
    private readonly AppDbContext _context;
    private readonly DbConnection _conn;
    private readonly CustomResponse _res = new();
    private readonly ExpenseDto _dto = new();

    public ExpenseService(AppDbContext context)
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

            using var multi = await _conn.QueryMultipleAsync(
                "usp_GetGroupExpenses",
                new
                {
                    p_GroupId = groupId
                },
                commandType: CommandType.StoredProcedure
                );

            _dto.ExpenseList =
            (
                await multi.ReadAsync<ExpenseDto.ExpenseListDto>()
            ).ToList();

            _dto.ExpenseParticipant =
            (
                await multi.ReadAsync<ExpenseDto.ExpenseParticipantDto>()
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

    public async Task<CustomResponse> Create(JObject obj)
    {
        DbTransaction? transaction = null;

        try
        {
            var expensePayload = obj["Expense"] as JObject ?? obj;
            var expense = expensePayload.ToObject<ExpenseDto.CreateExpenseDto>()!;

            if (expense == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Expense payload is required.";

                return _res;
            }

            if (expense.GroupId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Group Id is required.";

                return _res;
            }

            if (string.IsNullOrWhiteSpace(expense.Description))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Description is required.";

                return _res;
            }

            if (expense.Amount <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Amount must be greater than zero.";

                return _res;
            }

            if (expense.PaidByUserId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Paid By User is required.";

                return _res;
            }

            if (expense.ParticipantIds == null || expense.ParticipantIds.Count == 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "At least one participant is required.";

                return _res;
            }

            expense.ParticipantIds = expense.ParticipantIds.Distinct().ToList();

            if (!expense.ParticipantIds.Contains(expense.PaidByUserId))
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message =
                    "Payer must be included in participants.";

                return _res;
            }

            var validation =
                await _conn.QueryFirstOrDefaultAsync<ExpenseDto.ExpenseValidationDto>(
                    "usp_ValidateExpenseData",
                    new
                    {
                        p_GroupId = expense.GroupId,
                        p_PaidByUserId = expense.PaidByUserId
                    },
                    commandType: CommandType.StoredProcedure
                    );

            if (validation == null || !validation.GroupExists)
            {
                _res.IsSuccess = false;
                _res.Title = "Not Found";
                _res.Message = "Group not found.";

                return _res;
            }

            if (!validation.PayerIsMember)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message =
                    "Payer is not a member of this group.";

                return _res;
            }

            int participantCount = expense.ParticipantIds.Count;
            decimal normalShare = Math.Round(
                expense.Amount / participantCount,
                2,
                MidpointRounding.AwayFromZero
                );

            decimal calculatedTotal = normalShare * participantCount;
            decimal difference = expense.Amount - calculatedTotal;

            var splitList = new List<ExpenseDto.ExpenseSplitDto>();

            foreach (int userId in expense.ParticipantIds)
            {
                decimal shareAmount = normalShare;

                if (userId == expense.PaidByUserId)
                {
                    shareAmount += difference;
                }

                decimal netAmount;

                if (userId == expense.PaidByUserId)
                {
                    netAmount = expense.Amount - shareAmount;
                }
                else
                {
                    netAmount = -shareAmount;
                }

                splitList.Add(
                    new ExpenseDto.ExpenseSplitDto()
                    {
                        UserId = userId,
                        ShareAmount = shareAmount,
                        NetAmount = netAmount
                    }
                    );
            }

            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            transaction = await _conn.BeginTransactionAsync();

            var createdExpense = await _conn
                .QueryFirstOrDefaultAsync<ExpenseDto.ExpenseCreatedDto>(
                    "usp_CreateExpense",
                    new
                    {
                        p_GroupId = expense.GroupId,
                        p_Description = expense.Description,
                        p_Amount = expense.Amount,
                        p_PaidByUserId = expense.PaidByUserId
                    },
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                    );

            if (createdExpense == null)
            {
                await transaction.RollbackAsync();

                _res.IsSuccess = false;
                _res.Title = "Error";
                _res.Message = "Unable to create expense.";

                return _res;
            }

            foreach (var split in splitList)
            {
                await _conn.ExecuteAsync(
                    "usp_AddExpenseParticipant",
                    new
                    {
                        p_ExpenseId = createdExpense.ExpenseId,
                        p_UserId = split.UserId,
                        p_ShareAmount = split.ShareAmount,
                        p_NetAmount = split.NetAmount
                    },

                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                    );
            }

            await transaction.CommitAsync();

            _dto.ExpenseDetail = createdExpense;
            _dto.Splits = splitList;

            _res.IsSuccess = true;
            _res.Title = "Created";
            _res.Message = "Expense Created Successfully";
            _res.Data = _dto;

        }
        catch (Exception ex)
        {
            if (transaction != null)
            {
                await transaction.RollbackAsync();
            }

            _res.IsSuccess = false;
            _res.Title = "Error";
            _res.Message = ex.Message;
        }

        return _res;
    }
}
