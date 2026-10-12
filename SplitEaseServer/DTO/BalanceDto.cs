using SplitEase.DTO;

namespace SplitEase.DTO;

public class BalanceDto
{
    public List<UserBalanceDto> UserBalances { get; set; } = new();
    public List<DebtDto> Debts { get; set; } = new();
}

public class UserBalanceDto
{
    public int UserId { get; set; }
    public string? Name { get; set; }
    public decimal RawBalance { get; set; }
    public decimal AmountPaidInSettlement { get; set; }
    public decimal AmountReceivedInSettlement { get; set; }
    public decimal FinalBalance { get; set; }
}

public class DebtDto
{
    public int FromUserId { get; set; }
    public string? FromUserName { get; set; }
    public int ToUserId { get; set; }
    public string? ToUserName { get; set; }
    public decimal Amount { get; set; }
}