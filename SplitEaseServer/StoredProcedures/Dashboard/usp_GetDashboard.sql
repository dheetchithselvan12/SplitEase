delimiter $$

create procedure usp_GetDashboard(
    in p_UserId int
)

begin
    select 
        coalesce(
            sum(
                case 
                    when BalanceAmount < 0
                    then ABS(BalanceAmount)
                    else  0
                end 
            ),0
        ) as TotalOwed,
        
        coalesce(
            sum(
                case 
                    when BalanceAmount > 0
                    then BalanceAmount
                    else 0
                end
            ),0
        ) as TotalToReceive,
        
        coalesce(
            sum(BalanceAmount),0
        ) as NetBalance
    
    from
        (
            select 
                g.GroupId,
                (
                    coalesce(
                        (
                            select sum(ep.NetAmount)
                            from ExpenseParticipants ep
                            inner join Expenses e
                                on e.ExpenseId = ep.ExpenseId
                            where e.GroupId = g.GroupId
                                and ep.UserId = p_UserId
                            ),0
                    )
                    +
                    coalesce(
                    (
                        select sum(s.Amount)
                        from Settlements s
                        where s.GroupId = g.GroupId
                            and s.PayerId = p_UserId
                        ),0
                    )
                    -
                    coalesce(
                    (
                        select sum(s.Amount)
                        from Settlements s
                        where s.GroupId = g.GroupId
                            and s.ReceiverId = p_UserId
                        ),0
                    )
                    ) as BalanceAmount
            
            from Groups g
            inner join GroupMembers gm
                on gm.GroupId = g.GroupId
            where gm.UserId = p_UserId
        ) as UserBalances;

select
    g.GroupId,
    g.Name,
    g.Description,
    g.CreatedBy,
    g.CreatedAt,
    count(gm2.GroupMemberId) as MemberCount
from Groups g
inner join GroupMembers gm
    on gm.GroupId = g.GroupId
    and gm.UserId = p_UserId
left join GroupMembers gm2
    on gm2.GroupId = g.GroupId
group by
    g.GroupId,
    g.Name,
    g.Description,
    g.CreatedBy,
    g.CreatedAt
order by 
    g.CreatedAt desc;

select
    e.ExpenseId,
    e.GroupId,
    g.Name as GroupName,
    e.Description,
    e.Amount,
    e.PaidByUserId,
    u.Name as PaidByName,
    e.CreatedAt
from Expenses e
inner join Groups g
    on g.GroupId = e.GroupId
inner join GroupMembers gm
    on gm.GroupId = e.GroupId
inner join Users u
    on u.UserId = e.PaidByUserId
where gm.UserId = p_UserId
order by e.CreatedAt desc
limit 5;
end $$

delimiter ;