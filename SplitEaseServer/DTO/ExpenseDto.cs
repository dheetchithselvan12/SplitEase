namespace SplitEase.DTO;

public class ExpenseDto
{
    public List<ExpenseListDto> ExpenseList { get; set; } = new();
    
    public List<ExpenseParticipantDto> ExpenseParticipant { get; set; } = new();
    
    public ExpenseCreatedDto? ExpenseDetail { get; set; }
    
    public List<ExpenseSplitDto> Splits { get; set; } = new();
    
    
    public class CreateExpenseDto
    {
        public int GroupId { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int PaidByUserId { get; set; }
        public List<int> ParticipantIds { get; set; } = new();
    }
    
    public class ExpenseCreatedDto
    {
        public int ExpenseId { get; set; }
        public int GroupId { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int PaidByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class ExpenseListDto
    {
        public int ExpenseId { get; set; }
        public int GroupId { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public int PaidByUserId { get; set; }
        public string? PaidByName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class ExpenseParticipantDto
    {
        public int ExpenseParticipantId { get; set; }
        public int ExpenseId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public decimal ShareAmount { get; set; }
        public decimal NetAmount { get; set; }
    }
    
    public class ExpenseSplitDto
    {
        public int UserId { get; set; }
        public decimal ShareAmount { get; set; }
        public decimal NetAmount { get; set; }
    }
    
    public class ExpenseValidationDto
    {
        public bool GroupExists { get; set; }

        public bool PayerIsMember { get; set; }
    }
}

