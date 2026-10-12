

namespace SplitEase.DTO;

public class GroupDto
{
    public List<GroupListDto> GroupList { get; set; } = new();
    public GroupDetailDto? GroupDetail { get; set; }
    public List<GroupMemberDto> GroupMembers { get; set; } = new();
    public List<GroupExpenseDto> RecentExpenses { get; set; } = new();
}

public class GroupListDto
{
    public int GroupId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int CreatedBy { get; set; }
    public int MemberCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GroupDetailDto
{
    public int GroupId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GroupMemberDto
{
    public int GroupMemberId { get; set; }
    public int GroupId { get; set; }
    public int UserId { get; set; }
    public string? Name { get; set; }
    public string? Mobile { get; set; }
    public DateTime JoinedAt { get; set; }
}

public class GroupExpenseDto
{
    public int ExpenseId { get; set; }
    public int GroupId { get; set; }
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public int PaidByUserId { get; set; }
    public string? PaidByName { get; set; }
}

public class AddGroupMemberDto
{
    public int GroupId { get; set; }
    public string? Mobile { get; set; }
}