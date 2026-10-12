using System.Data;
using System.Data.Common;
using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;
using Dapper;
using Microsoft.EntityFrameworkCore;
using SplitEase.Data;
using SplitEase.DTO;
using SplitEase.Utils;

namespace SplitEase.Services.SettlementService;

public class SettlementService : ISettlementService
{
    private readonly AppDbContext _context;
    private readonly DbConnection _conn;

    private readonly CustomResponse _res = new();
    private readonly SettlementDto _dto = new();

    public SettlementService(AppDbContext context)
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
                _res.Message =
                    "Invalid Group Id.";

                return _res;
            }

            _dto.SettlementList =
            (
                await _conn
                    .QueryAsync<SettlementListDto>(
                        "usp_GetGroupSettlements",
                        new
                        {
                            p_GroupId = groupId
                        },
                        commandType: CommandType.StoredProcedure
                    )
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
        try
        {
            var settlementPayload = obj["Settlement"] as JObject ?? obj;
            var settlement = settlementPayload.ToObject<CreateSettlementDto>()!;

            if (settlement.GroupId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Group Id is required.";

                return _res;
            }

            if (settlement.PayerId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Payer Id is required.";

                return _res;
            }

            if (settlement.ReceiverId <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Receiver Id is required.";

                return _res;
            }

            if (settlement.PayerId == settlement.ReceiverId)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Payer and Receiver cannot be the same user.";

                return _res;
            }

            if (settlement.Amount <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = "Settlement amount must be greater than zero.";

                return _res;
            }

            var outstanding =
                await _conn
                    .QueryFirstOrDefaultAsync<OutstandingDebtDto>(
                        "usp_GetOutstandingDebt",
                        new
                        {
                            p_GroupId = settlement.GroupId,
                            p_PayerId = settlement.PayerId,
                            p_ReceiverId = settlement.ReceiverId
                        },
                        commandType: CommandType.StoredProcedure
                        );

            if (outstanding == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Error";
                _res.Message = "Unable to calculate outstanding debt.";

                return _res;
            }

            if (outstanding.OutstandingAmount <= 0)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";

                _res.Message = "No outstanding debt exists between these users.";

                return _res;
            }

            if (settlement.Amount > outstanding.OutstandingAmount)
            {
                _res.IsSuccess = false;
                _res.Title = "Validation Error";
                _res.Message = $"Settlement amount cannot exceed outstanding amount of {outstanding.OutstandingAmount:F2}.";

                return _res;
            }

            var createdSettlement = await _conn
                .QueryFirstOrDefaultAsync<SettlementListDto>(
                    "usp_CreateSettlement",
                    new
                    {
                        p_GroupId = settlement.GroupId,
                        p_PayerId = settlement.PayerId,
                        p_ReceiverId = settlement.ReceiverId,
                        p_Amount = settlement.Amount
                    },
                    commandType: CommandType.StoredProcedure
                    );

            if (createdSettlement == null)
            {
                _res.IsSuccess = false;
                _res.Title = "Error";
                _res.Message = "Unable to create settlement.";

                return _res;
            }

            _dto.SettlementDetail = createdSettlement;
            _dto.OutstandingDebt = outstanding;

            _res.IsSuccess = true;
            _res.Title = "Created";
            _res.Message = "Settlement Created Successfully";

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