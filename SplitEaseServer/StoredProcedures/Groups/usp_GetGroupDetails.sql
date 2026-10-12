delimiter $$

create procedure usp_GetGroupDetails(in p_GroupId int)
begin   
    select 
        g.GroupId,
        g.Name,
        g.Description,
        g.CreatedBy,
        u.Name as CreatedByName,
        g.CreatedAt
    from `Groups` g
    inner join Users u
        on u.UserId = g.CreatedBy
    where g.GroupId = p_GroupId;

    select 
        gm.GroupMemberId,
        gm.GroupId,
        gm.UserId,
        u.Name,
        u.Mobile,
        gm.JoinedAt
    from GroupMembers gm
    inner join Users u
        on u.UserId = gm.UserId
    where gm.GroupId = p_GroupId
    order by gm.JoinedAt;

    select 
        e.ExpenseId,
        e.GroupId,
        e.Description,
        e.Amount,
        e.PaidByUserId,
        u.Name as PaidByName,
        e.CreatedAt
    from Expenses e
    inner join Users u
        on u.UserId = e.PaidByUserId
    where e.GroupId = p_GroupId
    order by e.CreatedAt desc
    limit 5;

end $$

delimiter ;