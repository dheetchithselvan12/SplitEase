namespace SplitEase.DTO;

public class SettlementDto
{
    public List<SettlementListDto>
        SettlementList { get; set; } = new();

    public SettlementListDto?
        SettlementDetail { get; set; }

    public OutstandingDebtDto?
        OutstandingDebt { get; set; }
}


public class CreateSettlementDto
{
    public int GroupId { get; set; }

    public int PayerId { get; set; }

    public int ReceiverId { get; set; }

    public decimal Amount { get; set; }
}


public class SettlementListDto
{
    public int SettlementId { get; set; }

    public int GroupId { get; set; }

    public int PayerId { get; set; }

    public string? PayerName { get; set; }

    public int ReceiverId { get; set; }

    public string? ReceiverName { get; set; }

    public decimal Amount { get; set; }

    public DateTime SettledAt { get; set; }
}


public class OutstandingDebtDto
{
    public decimal PayerBalance { get; set; }

    public decimal ReceiverBalance { get; set; }

    public decimal OutstandingAmount { get; set; }
}