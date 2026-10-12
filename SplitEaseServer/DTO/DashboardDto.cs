namespace SplitEase.DTO;

public class DashboardDto
{
    public DashboardSummaryDto? Summary { get; set; }
    public List<DashboardGroupDto> GroupList { get; set; } = new();
    public List<DashboardExpenseDto> RecentExpenses { get; set; } = new();
}

public class DashboardSummaryDto
{
    public decimal TotalOwed { get; set; }
    public decimal TotalToReceive { get; set; }
    public decimal NetBalance { get; set; }
}

public class DashboardGroupDto
{
    public int GroupId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int CreatedBy { get; set; }
    public int MemberCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class DashboardExpenseDto
{
    public int ExpenseId { get; set; }
    public int GroupId { get; set; }
    public string? GroupName { get; set; }
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public int PaidByUserId { get; set; }
    public string? PaidByName { get; set; }
    public DateTime CreatedAt { get; set; }
}