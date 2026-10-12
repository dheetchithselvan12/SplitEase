delimiter $$

create procedure usp_GetGroupExpenses(
    in p_GroupId int
)

begin
    
    select
        e.ExpenseId,
        e.GroupId,
        e.Description,
        e.Amount,
        e.PaidByUserId,
        u.Name AS PaidByName,
        e.CreatedAt
    from Expenses e
    inner join Users u
        on u.UserId = e.PaidByUserId
    where e.GroupId = p_GroupId
    order by e.CreatedAt desc;

    select
        ep.ExpenseParticipantId,
        ep.ExpenseId,
        ep.UserId,
        u.Name AS UserName,
        ep.ShareAmount,
        ep.NetAmount
    from ExpenseParticipants ep
    inner join Users u
        on u.UserId = ep.UserId
    inner join Expenses e
        on e.ExpenseId = ep.ExpenseId
    where e.GroupId = p_GroupId
    order by ep.ExpenseId desc;

end $$

delimiter ;